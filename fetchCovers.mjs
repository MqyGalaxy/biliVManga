import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// --- 配置区 ---
const INPUT_CSV = './src/data/comics.csv';             // 你原始表格的路径
const OUTPUT_CSV = './src/data/comics_with_cover.csv'; // 生成的新表格路径
const COVERS_DIR = './public/covers';                  // 下载图片存放的 Astro public 目录

// 确保封面目录存在
if (!fs.existsSync(COVERS_DIR)) {
    fs.mkdirSync(COVERS_DIR, { recursive: true });
}

// 伪装浏览器请求头防止 B 站 API 拦截
const BILIBILI_COOKIE = process.env.BILIBILI_COOKIE?.trim() || '';

const HEADERS = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/152.0.0.0 Safari/537.36',

    'Referer': 'https://www.bilibili.com/',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',

    ...(BILIBILI_COOKIE
        ? { 'Cookie': BILIBILI_COOKIE }
        : {})
};

let bilibiliBlocked = false;

async function downloadCover(bvid) {
    try {
        // 1. 请求 B 站 API 获取视频信息
        const apiRes = await fetch(
            `https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(bvid)}`,
            {
                headers: HEADERS,
                redirect: 'follow'
            }
        );

        const contentType = apiRes.headers.get('content-type') || '';
        const rawText = await apiRes.text();

        console.log(`🌐 [${bvid}] API Status: ${apiRes.status}`);
        console.log(`🌐 [${bvid}] Content-Type: ${contentType}`);

        // 尝试解析 JSON，但不直接调用 apiRes.json()
        let data = null;

        if (contentType.includes('application/json')) {
            try {
                data = JSON.parse(rawText);
            } catch {
                console.log(`⚠️ [${bvid}] JSON 解析失败`);
            }
        }

        // B站 412 风控
        if (
            apiRes.status === 412 ||
            data?.code === -412
        ) {
            console.log(`🚫 [${bvid}] B站触发 412 风控: request was banned`);
            console.log(`🚫 停止继续请求，避免风控进一步加重`);

            bilibiliBlocked = true;
            return null;
        }

        // HTTP 层错误
        if (!apiRes.ok) {
            console.log(`⚠️ [${bvid}] API HTTP 错误: ${apiRes.status}`);
            console.log(rawText.slice(0, 300));
            return null;
        }

        // 返回的不是 JSON
        if (!data) {
            console.log(`⚠️ [${bvid}] B站返回的不是有效 JSON`);
            console.log(rawText.slice(0, 300));
            return null;
        }

        // B站 API 自身返回错误
        if (data.code !== 0) {
            console.log(
                `❌ [${bvid}] B站 API 错误: code=${data.code}, message=${data.message}`
            );
            return null;
        }

        if (!data.data?.pic) {
            console.log(`❌ [${bvid}] 没有获取到封面地址，可能视频已失效`);
            return null;
        }

        // 2. 拼接后缀压缩为 WebP
        const picUrl = data.data.pic.replace('http://', 'https://') + '@400w_225h_1c.webp';
        
        // 3. 下载图片
        const imgRes = await fetch(picUrl, { headers: HEADERS });
        if (!imgRes.ok) throw new Error(`图片下载失败: ${imgRes.status}`);

        // 4. 兼容性极强的 Buffer 写入方式
        const arrayBuffer = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const fileName = `${bvid}.webp`;
        const filePath = path.join(COVERS_DIR, fileName);
        
        fs.writeFileSync(filePath, buffer);
        console.log(`✅ [${bvid}] 下载成功 -> ${fileName}`);
        
        // 返回可以供 Astro 直接读取的本地相对路径
        return `/covers/${fileName}`;

    } catch (error) {
        console.log(`❌ [${bvid}] 发生错误:`, error.message);
        return null;
    }
}

// 延迟函数，防止请求过快被封禁
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function main() {
    console.log('🚀 开始智能解析 CSV 并下载封面...');
    
    if (!fs.existsSync(INPUT_CSV)) {
        console.error(`❌ 找不到输入文件: ${INPUT_CSV}`);
        return;
    }

    const csvData = fs.readFileSync(INPUT_CSV, 'utf8');
    
    // 使用二维数组的方式解析，而不是强行把第一行当做表头
    Papa.parse(csvData, {
        skipEmptyLines: true,
        complete: async (results) => {
            const rawRows = results.data;
            let headerIndex = -1;
            
            // 智能寻找表头所在的行
            for(let i=0; i < Math.min(20, rawRows.length); i++){
                if(rawRows[i] && (rawRows[i].includes('原视频标题') || rawRows[i].includes('标题') || rawRows[i].includes('译名'))){
                    headerIndex = i; 
                    break;
                }
            }

            if(headerIndex === -1) {
                console.error("❌ 找不到表头，请确认表格里是否有【原视频标题】或【译名】列！");
                return;
            }

            const headers = rawRows[headerIndex];
            let coverIndex = headers.indexOf('封面');

            // 如果原本没有封面列，自动在表头末尾加上
            if (coverIndex === -1) {
                headers.push('封面');
                coverIndex = headers.length - 1;
                console.log('✨ 自动为表格添加了 [封面] 列');
            }

            // 寻找链接所在的列索引
            const linkIndex = headers.findIndex(h => h && ['翻译视频链接', 'bilibili', 'b站', '转载链接'].some(keyword => h.toLowerCase().includes(keyword)));
            
            if (linkIndex === -1) {
                console.error("❌ 找不到包含 B站链接 的列！");
                return;
            }

            let downloadCount = 0;

            // 遍历数据行（从表头的下一行开始）
            for (let i = headerIndex + 1; i < rawRows.length; i++) {
                const row = rawRows[i];
                const link = row[linkIndex];

                if (link) {
                    const match = link.match(/(BV[a-zA-Z0-9]{10})/i);
                    if (match) {
                        const bvid = match[1];
                        
                        // 断点续传 / 已下载封面检查
                        const expectedLocalPath = path.join(
                            COVERS_DIR,
                            `${bvid}.webp`
                        );

                        // ① 本地已经存在：无论有没有触发 412，都直接实装
                        if (fs.existsSync(expectedLocalPath)) {
                            console.log(`✅ [${bvid}] 本地已有封面，实装到 CSV`);

                            row[coverIndex] = `/covers/${bvid}.webp`;

                            continue;
                        }

                        // ② 已经触发过 412：禁止继续请求 B站
                        // 本地又没有封面，所以什么都不修改
                        if (bilibiliBlocked) {
                            console.log(
                                `⏭️ [${bvid}] 412 风控中，本地无封面，保持原样`
                            );

                            continue;
                        }

                        // ③ 尚未触发 412，正常尝试下载
                        const localPath = await downloadCover(bvid);

                        if (localPath) {
                            row[coverIndex] = localPath;
                            downloadCount++;
                        }

                        // 如果刚刚这个请求触发了 412
                        // 不 break，后面继续扫描 CSV
                        if (bilibiliBlocked) {
                            console.log('\n🛑 Bilibili API 已触发 412');
                            console.log('📦 停止联网下载，但继续扫描已有本地封面\n');

                            continue;
                        }

                        // 随机等待 2~4 秒
                        const waitTime =
                            2000 + Math.floor(Math.random() * 2000);

                        console.log(
                            `⏳ 等待 ${(waitTime / 1000).toFixed(1)} 秒...`
                        );

                        await delay(waitTime);
                    }
                }
            }

            // 将处理好的数据转回 CSV 格式
            const newCsv = Papa.unparse(rawRows);
            fs.writeFileSync(OUTPUT_CSV, newCsv, 'utf8');
            console.log(`\n🎉 全部完成！本次新增下载 ${downloadCount} 张封面。`);
            console.log(`📁 新表格已成功保存为: ${OUTPUT_CSV}`);
        }
    });
}

main();