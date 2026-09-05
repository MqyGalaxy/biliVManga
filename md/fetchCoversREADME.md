# Bilibili 封面批量下载脚本 — 使用注意事项

## 1. 脚本用途

本脚本会从 CSV 中提取 Bilibili BV 号，并：

1. 优先检查 `public/covers/` 中是否已经存在对应封面；
2. 本地存在时直接把 `/covers/BV号.webp` 写入 CSV，不请求 Bilibili API；
3. 本地不存在时才请求 Bilibili 视频信息 API；
4. 下载成功后保存为 WebP；
5. 遇到不可访问的视频时保持原 CSV 内容不变。

---

## 2. Cookie 很重要

Bilibili 目前可能对没有正常浏览器会话的 Node.js 请求返回：

```text
HTTP 412
code = -412
message = request was banned
```

建议运行脚本前，从已经正常登录 Bilibili 的浏览器复制当前请求的完整 Cookie。

### VS Code PowerShell 推荐方式

先把 Cookie 复制到剪贴板，然后运行：

```powershell
$env:BILIBILI_COOKIE = (Get-Clipboard).Trim()
$env:BILIBILI_COOKIE.Length
node fetchCovers.mjs
```

运行结束后清除：

```powershell
Remove-Item Env:BILIBILI_COOKIE
```

### 安全注意

Cookie 属于登录凭证。

不要：

- 把 Cookie 发给别人；
- 把 Cookie 写死在 `.mjs` 文件中；
- 把 Cookie 提交到 GitHub；
- 在公开截图中展示 `SESSDATA`、`bili_jct`、`DedeUserID` 等字段。

Cookie 过期后需要重新从浏览器复制。

---

## 3. 本地已有封面不会请求 API

脚本首先检查：

```text
public/covers/BV号.webp
```

只要这个文件存在，就会：

```text
本地封面存在
→ 写入 CSV
→ continue
→ 不请求 Bilibili API
```

因此已经下载过的封面不会重复查询。

注意文件名必须与 BV 号完全对应，例如：

```text
public/covers/BV1xxxxxxxxx.webp
```

`.jpg`、`.png`、自定义前缀文件名等不会被自动识别。

---

## 4. 永久跳过名单

脚本使用：

```text
src/data/bilibili_skip_bvids.json
```

保存不值得反复查询的 BV。

以下 API 错误会被加入永久跳过名单：

```text
62012   仅 UP 主自己可见
62002   视频不可见
-404    视频不存在 / 已失效
```

以后再次运行脚本时：

```text
本地没有封面
+
BV 已在永久跳过名单
→ 不请求 API
→ 保持 CSV 原样
```

### 62004 不会永久记录

```text
62004 = 视频正在审核中
```

这是可能变化的临时状态，因此脚本只会本次跳过，下次运行仍可重新查询。

### 如果视频以后恢复公开

由于 `62012 / 62002 / -404` 会被永久跳过，如果某个视频后来恢复公开，需要手动打开：

```text
src/data/bilibili_skip_bvids.json
```

删除对应 BV 后，脚本下次才会重新查询。

不要随意破坏 JSON 格式。

正确示例：

```json
[
  "BV1xxxxxxxxx",
  "BV1yyyyyyyyyy"
]
```

---

## 5. 遇到 412 时的行为

一旦视频信息 API 或封面图片请求出现 412：

```text
检测到 412
→ bilibiliBlocked = true
→ 本次运行停止所有新的 Bilibili 网络请求
```

但脚本不会直接退出。

它仍会继续扫描剩余 CSV：

```text
本地已有封面 → 正常实装
本地没有封面 → 保持原样
```

这样可以避免已经下载的封面因为一次风控而无法写回 CSV。

如果出现 412，不建议立即反复重新运行脚本。

首先确认：

1. 浏览器直接打开同一个 Bilibili API 是否正常；
2. `BILIBILI_COOKIE` 是否已经正确设置；
3. Cookie 是否过期；
4. 是否正在使用 VPN、代理或共享出口。

---

## 6. 请求间隔

正常联网请求之间会随机等待约：

```text
2 ～ 4 秒
```

这是为了避免短时间连续访问 API。

不建议把延迟改成非常短的固定间隔，例如：

```text
100 ms
500 ms
```

---

## 7. 输入和输出文件

默认配置：

```text
输入：
./src/data/comics.csv

输出：
./src/data/comics_with_cover.csv

封面：
./public/covers/

永久跳过名单：
./src/data/bilibili_skip_bvids.json
```

脚本不会直接覆盖原始 `comics.csv`。

处理完成后请使用：

```text
comics_with_cover.csv
```

作为生成结果。

---

## 8. CSV 要求

脚本会在前 20 行中寻找包含以下任一字段的表头：

```text
原视频标题
标题
译名
```

并寻找包含以下关键词之一的 Bilibili 链接列：

```text
翻译视频链接
bilibili
b站
转载链接
```

如果没有 `封面` 列，脚本会自动添加。

BV 链接中必须能提取类似：

```text
BV1xxxxxxxxx
```

的标准 BV 号。

---

## 9. 常见日志解释

### 正常下载

```text
API Status: 200
Content-Type: application/json
✅ 下载成功
```

表示 API 和封面下载正常。

### 本地已有

```text
✅ 本地已有封面，实装到 CSV
```

不会请求 API。

### 永久跳过

```text
⏭️ 已在永久跳过名单中，不再查询 API，保持原样
```

不会请求 API。

### 62012 / 62002 / -404

首次遇到时会加入：

```text
bilibili_skip_bvids.json
```

以后不再查询。

### 62004

```text
⏳ 视频正在审核中，暂时跳过并保持原样
```

不会写入永久跳过名单。

### 412

```text
🚫 B站触发 412 风控
```

本次运行立即停止新的联网请求，但仍会继续处理已有本地封面。

---

## 10. 建议备份

批量运行前建议备份：

```text
src/data/comics.csv
src/data/bilibili_skip_bvids.json
```

`public/covers/` 中的封面也建议纳入正常项目备份。

如果误把某个 BV 加入永久跳过名单，只需从 JSON 中删除该 BV 即可恢复查询。
