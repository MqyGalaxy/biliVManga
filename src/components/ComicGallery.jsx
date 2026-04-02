import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse'; 
import Logo from './svgs/Logo.jsx';

// 图标 SVG 组件
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const AuthorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const UpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/><path d="M12 10v9"/></svg>;
const DateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const BiliIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path fill="currentColor" d="M488.6 104.1c16.7 18.1 24.4 39.7 23.3 65.7l0 202.4c-.4 26.4-9.2 48.1-26.5 65.1-17.2 17-39.1 25.9-65.5 26.7L92 464c-26.4-.8-48.2-9.8-65.3-27.2-17.1-17.4-26-40.3-26.7-68.6L0 169.8c.8-26 9.7-47.6 26.7-65.7 17.1-16.3 38.8-25.3 65.3-26.1l29.4 0-25.4-25.8c-5.7-5.7-8.6-13-8.6-21.8s2.9-16.1 8.6-21.8 13-8.6 21.9-8.6 16.1 2.9 21.9 8.6l73.3 69.4 88 0 74.5-69.4C381.7 2.9 389.2 0 398 0s16.1 2.9 21.9 8.6c5.7 5.7 8.6 13 8.6 21.8s-2.9 16.1-8.6 21.8L394.6 78 423.9 78c26.4 .8 48 9.8 64.7 26.1zm-38.8 69.7c-.4-9.6-3.7-17.4-10.7-23.5-5.2-6.1-14-9.4-22.7-9.8l-320.4 0c-9.6 .4-17.4 3.7-23.6 9.8-6.1 6.1-9.4 13.9-9.8 23.5l0 194.4c0 9.2 3.3 17 9.8 23.5s14.4 9.8 23.6 9.8l320.4 0c9.2 0 17-3.3 23.3-9.8s9.7-14.3 10.1-23.5l0-194.4zM185.5 216.5c6.3 6.3 9.7 14.1 10.1 23.2l0 33.3c-.4 9.2-3.7 16.9-9.8 23.2-6.2 6.3-14 9.5-23.6 9.5s-17.5-3.2-23.6-9.5-9.4-14-9.8-23.2l0-33.3c.4-9.1 3.8-16.9 10.1-23.2s13.2-9.6 23.3-10c9.2 .4 17 3.7 23.3 10zm191.5 0c6.3 6.3 9.7 14.1 10.1 23.2l0 33.3c-.4 9.2-3.7 16.9-9.8 23.2s-14 9.5-23.6 9.5-17.4-3.2-23.6-9.5c-7-6.3-9.4-14-9.7-23.2l0-33.3c.3-9.1 3.7-16.9 10-23.2s14.1-9.6 23.3-10c9.2 .4 17 3.7 23.3 10z"/><polyline points="17 2 12 7 7 2"/></svg>;
// Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2025 Fonticons, Inc.
const JumpLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
const FileUploadBigIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 12v6"/><path d="m15 15-3-3-3 3"/></svg>;
const HeartOutlineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const HeartFilledIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

// 用于随机打乱数组顺序
const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export default function ComicGallery({ initialData = [], initialHeaders = [] }) {
    const [data, setData] = useState(initialData);
    const [tableHeaders, setTableHeaders] = useState(initialHeaders);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // 专门用于过滤 UP主 的独立状态
    const [selectedUploader, setSelectedUploader] = useState(null);

    const [page, setPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showAnnouncement, setShowAnnouncement] = useState(false);
    
    // 收藏功能的状态
    const [favorites, setFavorites] = useState([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // 视图模式状态 (gallery 或者是 uploaders)
    const [viewMode, setViewMode] = useState('gallery'); 

    const [inputPage, setInputPage] = useState("1");
    
    const itemsPerPage = 12;
    const customTags = ["青梅竹马", "前女友", "后辈", "上司", "学生会长", "学姐", "偶像" , "千金", "大小姐", "连载"];

    // 修改公告版本号 (1)
    useEffect(() => {
        const hasSeen = localStorage.getItem('announcement_2026v1');
        if (!hasSeen) {
            setShowAnnouncement(true);
        }
    }, []);

    // 页面加载时读取收藏记录
    useEffect(() => {
        const savedFavs = localStorage.getItem('biliVManga_favorites');
        if (savedFavs) {
            try {
                setFavorites(JSON.parse(savedFavs));
            } catch (e) {
                console.error("解析收藏数据失败", e);
            }
        }
    }, []);

    // 当收藏记录改变时，保存到本地
    useEffect(() => {
        localStorage.setItem('biliVManga_favorites', JSON.stringify(favorites));
    }, [favorites]);

    // 修改公告版本号 (2)
    const closeAnnouncement = () => {
        localStorage.setItem('announcement_2026v1', 'true');
        setShowAnnouncement(false);
    };

    useEffect(() => {
        if (initialData.length > 0) {
            setData(shuffleArray(initialData));
        }
    }, [initialData]);

    const cleanStr = str => str.replace(/\s+/g, '').toLowerCase();
    const getValue = (item, possibleKeys) => {
        if (!item) return '';
        const keys = Object.keys(item);
        
        // 1. 精确匹配
        for (let pk of possibleKeys) {
            const cleanPk = cleanStr(pk);
            const match = keys.find(k => cleanStr(k) === cleanPk);
            if (match && item[match] && typeof item[match] === 'string' && item[match].trim() !== '') return item[match].trim();
        }
        
        // 2. 模糊匹配
        for (let pk of possibleKeys) {
            const cleanPk = cleanStr(pk);
            const match = keys.find(k => cleanStr(k).includes(cleanPk));
            if (match && item[match] && typeof item[match] === 'string' && item[match].trim() !== '') return item[match].trim();
        }
        return '';
    };

    // 为每个卡片生成独一无二的收藏ID
    const getItemUniqueKey = (item) => {
        const originalTitle = getValue(item, ['原视频标题', '视频标题', '日文标题', '原标题']) || 'unknown_title';
        const translatedName = getValue(item, ['译名', '中文名', '翻译视频标题(黑字熟肉红字生肉)']) || 'unknown_trans';
        return `${originalTitle}_${translatedName}`;
    };

    // 点击爱心切换收藏状态
    const toggleFavorite = (e, item) => {
        if(e) e.stopPropagation(); // 防止点击爱心时触发卡片打开弹窗
        const key = getItemUniqueKey(item);
        if (favorites.includes(key)) {
            setFavorites(favorites.filter(k => k !== key));
        } else {
            setFavorites([...favorites, key]);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        setShowUploadModal(false);
        setLoading(true);

        Papa.parse(file, {
            complete: (results) => {
                const rawRows = results.data;
                let headerIndex = -1;
                for(let i=0; i < Math.min(20, rawRows.length); i++){
                    if(rawRows[i] && (rawRows[i].includes('原视频标题') || rawRows[i].includes('标题') || rawRows[i].includes('译名'))){
                        headerIndex = i; break;
                    }
                }
                if(headerIndex === -1) {
                    alert("找不到表头啦，请确认表格里是否有【原视频标题】或【译名】列！");
                    setLoading(false); return;
                }
                const headers = rawRows[headerIndex].map(h => h ? h.trim() : '');
                const items = [];
                for(let i = headerIndex + 1; i < rawRows.length; i++) {
                    const row = rawRows[i];
                    if(row.every(cell => !cell || cell.trim() === '')) continue;
                    let obj = {};
                    headers.forEach((header, index) => {
                        if(header && header !== '') {
                            obj[header] = row[index] ? row[index].trim() : '';
                        }
                    });
                    items.push(obj);
                }
                setTableHeaders(headers.filter(h => h !== ''));
                setData(shuffleArray(items));
                setLoading(false);
                setPage(1);
            },
            error: () => { alert("解析失败了！"); setLoading(false); }
        });
    };

    // 智能计算所有UP主的收录数量统计
    const uploaderStats = useMemo(() => {
        const stats = {};
        data.forEach(item => {
            const rawUploader = getValue(item, ['译者昵称', '译者', 'UP主昵称', '转载up主', 'UP主', '上传']) || '未知译者';
            const uploader = rawUploader.replace(/(^|[^a-zA-Z])[(（\[{【\s]*uid[:：\s]*\d+[)）\]}】\s]*/gi, '$1').trim() || '未知译者';
            
            // 只统计有标题的有效数据
            const translatedName = getValue(item, ['译名', '中文名', '翻译视频标题(黑字熟肉红字生肉)']);
            const originalTitle = getValue(item, ['原视频标题', '视频标题', '日文标题', '原标题']);
            if (!translatedName && !originalTitle) return;

            if (!stats[uploader]) {
                stats[uploader] = 0;
            }
            stats[uploader]++;
        });
        
        // 将对象转换为数组，并按收录数量从高到低排序
        return Object.entries(stats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [data]);

    const filteredData = useMemo(() => {
        // 第一层：剔除无标题无效数据
        let validData = data.filter(item => {
            const translatedName = getValue(item, ['译名', '中文名', '翻译视频标题(黑字熟肉红字生肉)']);
            const originalTitle = getValue(item, ['原视频标题', '视频标题', '日文标题', '原标题']);
            const link = getValue(item, ['翻译视频链接', '原视频链接']);
            if (!translatedName && !originalTitle) return false;
            return translatedName || originalTitle || link;
        });

        // 第二层：只看收藏逻辑拦截
        if (showFavoritesOnly) {
            const reversedFavs = [...favorites].reverse();
            
            validData = reversedFavs.map(favKey => {
                return validData.find(item => getItemUniqueKey(item) === favKey);
            }).filter(Boolean); // filter(Boolean) 是为了安全过滤掉原表格里可能已经被删除的失效收藏
        }

        // 第三层：独立处理点击进来的 UP主 过滤
        if (selectedUploader) {
            validData = validData.filter(item => {
                const rawUploader = getValue(item, ['译者昵称', '译者', 'UP主昵称', '转载up主', 'UP主', '上传']) || '未知译者';
                const uploader = rawUploader.replace(/(^|[^a-zA-Z])[(（\[{【\s]*uid[:：\s]*\d+[)）\]}】\s]*/gi, '$1').trim() || '未知译者';
                return uploader === selectedUploader;
            });
        }

        // 第四层：顶部的文字搜索框过滤
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            validData = validData.filter(item => {
                const translatedName = getValue(item, ['译名', '中文名', '翻译视频标题(黑字熟肉红字生肉)']).toLowerCase();
                const originalTitle = getValue(item, ['原视频标题', '视频标题']).toLowerCase();
                const author = getValue(item, ['原作者', '原视频作者', '作者']).toLowerCase();
                
                // 尊重您的意愿，这里不再读取译者进行搜索，彻底防误伤！
                return translatedName.includes(lowerSearch) || originalTitle.includes(lowerSearch) || author.includes(lowerSearch);
            });
        }

        return validData;
    }, [data, searchTerm, showFavoritesOnly, favorites, selectedUploader]); 

    const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
    const currentData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleJumpPage = () => {
        const targetPage = parseInt(inputPage, 10);
        if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages) {
            setPage(targetPage);
        } else {
            setInputPage(page.toString());
        }
    };

    useEffect(() => {
        setInputPage(page.toString());
    }, [page]);

    useEffect(() => {
        document.body.style.overflow = (selectedItem || showUploadModal || showAnnouncement) ? 'hidden' : 'auto';
    }, [selectedItem, showUploadModal, showAnnouncement]);

    // 监听翻页或视图切换，自动平滑滚动到顶部
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [page, viewMode, showFavoritesOnly, selectedUploader, searchTerm]);

    const getAvatarGradient = (str) => {
        const colors = ['from-wata-pink to-wata-purple', 'from-wata-cyan to-blue-400', 'from-wata-yellow to-orange-400', 'from-purple-400 to-pink-400', 'from-green-400 to-wata-cyan'];
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="min-h-screen pb-20">
            <style>{`
                @keyframes cardFadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in-active {
                    animation: cardFadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0; 
                }
            `}</style>

            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-wata-lightPink shadow-sm">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
                    
                    <a href="/" className="flex items-center gap-2 sm:gap-3 group hover:opacity-80 transition-opacity">
                        <div className="flex items-center justify-left gap-0 cursor-pointer">
                            <img src="/favicon.svg" alt="biliVManga" className="w-8 h-8 sm:w-10 sm:h-10" />
                            <div className="h-6 sm:h-8 w-auto ml-0">
                                <Logo />
                            </div>
                            <span className="hidden sm:inline-block text-[10px] font-bold text-wata-fff bg-wata-purple px-2 py-0.5 rounded-full ml-3">有声漫画汉化索引</span>
                        </div>
                    </a>

                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-wata-purple group-focus-within:text-wata-pink">
                                <SearchIcon />
                            </div>
                            <input 
                                type="text" 
                                placeholder="搜索译名、标题、作者..." 
                                className="w-full py-2 pl-11 pr-4 bg-wata-bg border-2 border-transparent rounded-full text-sm font-bold focus:outline-none focus:bg-white focus:border-wata-pink focus:shadow-wata transition-all"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value); 
                                    setPage(1); 
                                    setViewMode('gallery');
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:block text-xs sm:text-sm font-bold text-gray-500 bg-wata-lightPink px-3 py-1.5 rounded-full border border-wata-pink/20 transition-all">
                            共 {filteredData.length} 篇
                        </div>

                        {/* 我的收藏按钮 */}
                        <button 
                            onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setViewMode('gallery'); setPage(1); }}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-black text-xs sm:text-sm transition-all duration-300 cursor-pointer ${showFavoritesOnly ? 'bg-wata-pink text-white shadow-wata' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            title={showFavoritesOnly ? "查看全部" : "查看我的收藏"}
                        >
                            {showFavoritesOnly ? <HeartFilledIcon className="text-white" /> : <HeartOutlineIcon />}
                            <span className="hidden sm:inline-block">{showFavoritesOnly ? '查看全部' : '我的收藏'}</span>
                        </button>

                        <button 
                            onClick={() => setShowUploadModal(true)}
                            disabled={loading}
                            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-black text-xs sm:text-sm transition-all duration-300 shadow-wata hover:shadow-wata-hover hover:scale-105 cursor-pointer ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-wata-pink to-wata-purple text-white'}`}
                        >
                            <UploadIcon />
                            <span className="hidden sm:inline-block">{loading ? '解析中..' : '导入表格'}</span>
                        </button>
                    </div>
                </div>

                <div className="md:hidden px-4 pb-3">
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-wata-purple">
                            <SearchIcon />
                        </div>
                        <input 
                            type="text" 
                            placeholder="搜索译名..." 
                            className="w-full py-2.5 pl-11 pr-4 bg-wata-bg border-2 border-wata-lightPink rounded-full text-sm font-bold focus:outline-none focus:bg-white focus:border-wata-pink shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value); 
                                setPage(1); 
                                setViewMode('gallery');
                            }}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                
                {viewMode === 'uploaders' ? (
                    // UP 主列表
                    <div className="fade-in-active">
                        <div className="mb-6 sm:mb-8 relative flex flex-col items-center">
                            <div className="w-full flex justify-start mb-2 sm:absolute sm:top-0 sm:left-0 sm:mb-0">
                                <button 
                                    onClick={() => { setViewMode('gallery'); setPage(1); }}
                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-black text-xs sm:text-sm transition-all duration-300 bg-white border-2 border-wata-lightPink text-wata-purple hover:bg-wata-pink hover:text-white hover:border-wata-pink cursor-pointer shadow-sm"
                                >
                                    ← 返回作品库
                                </button>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-wata-dark">UP主集结地</h2>
                            <p className="text-sm font-bold text-gray-400 mt-2">感谢所有为有声漫画汉化付出心血的UP主们！点击头像可快速查看Ta的作品。</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
                            {uploaderStats.map((up, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => {
                                        // 点击触发专属的 selectedUploader 过滤
                                        setSelectedUploader(up.name);
                                        setViewMode('gallery');
                                        setShowFavoritesOnly(false);
                                        setPage(1);
                                        setSearchTerm(""); // 清空顶部的文本搜索，防止互相干扰
                                    }}
                                    className="flex flex-col items-center p-6 bg-white rounded-3xl border-2 border-transparent hover:border-wata-lightPink shadow-sm hover:shadow-wata-hover transition-all cursor-pointer group"
                                    style={{ animationFillMode: 'both', animationDelay: `${(index % 20) * 0.03}s` }}
                                >
                                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-black text-2xl sm:text-3xl bg-gradient-to-br ${getAvatarGradient(up.name)} shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        {up.name !== '未知译者' ? up.name.substring(0, 1).toUpperCase() : '?'}
                                    </div>
                                    <h3 className="font-black text-wata-dark text-sm sm:text-base text-center line-clamp-1 group-hover:text-wata-purple transition-colors" title={up.name}>
                                        {up.name}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 mt-1">共收录 {up.count} 篇</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // 视图 1：传统的作品画廊视图
                    <div className="fade-in-active">
                        {(data.length > 0 || selectedUploader) && (
                            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 items-center">
                                <span className="text-xs sm:text-sm font-black text-wata-purple mr-1">快速探索:</span>
                                
                                {/* UP 主列表按钮 */}
                                <button 
                                    onClick={() => { setViewMode('uploaders'); setPage(1); }}
                                    className="flex items-center gap-1 px-3 py-1 bg-wata-purple text-white text-[11px] sm:text-xs font-bold rounded-full hover:shadow-wata hover:scale-105 transition-all cursor-pointer"
                                    title="查看UP主列表"
                                >
                                    <UsersIcon /> UP主列表
                                </button>

                                {customTags.map((tag, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => {setSearchTerm(tag); setPage(1); setShowFavoritesOnly(false);}} // 点击标签时退出纯收藏模式
                                        className="px-3 py-1 bg-white border-2 border-wata-lightPink text-wata-dark text-[11px] sm:text-xs font-normal rounded-full hover:bg-wata-pink hover:text-white hover:border-wata-pink hover:shadow-wata transition-all cursor-pointer"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                                
                                <div className="ml-auto flex gap-2">
                                    {/* 取消 UP 主过滤按钮 */}
                                    {selectedUploader && (
                                        <button 
                                            onClick={() => {setSelectedUploader(null); setPage(1);}}
                                            className="flex items-center px-3 py-1 bg-wata-purple text-white text-[11px] sm:text-xs font-bold rounded-full hover:bg-opacity-80 transition-all cursor-pointer max-w-[150px] sm:max-w-none"
                                            title={`取消 UP主: ${selectedUploader}`}
                                        >
                                            <span className="shrink-0">取消 UP主: </span>
                                            <span className="truncate max-w-[50px] sm:max-w-[150px] mx-1">{selectedUploader}</span>
                                            <span className="shrink-0"> x</span>
                                        </button>
                                    )}

                                    {searchTerm && (
                                        <button 
                                            onClick={() => {setSearchTerm(""); setPage(1);}}
                                            className="px-3 py-1 bg-gray-100 text-gray-500 text-[11px] sm:text-xs font-bold rounded-full hover:bg-gray-200 transition-all cursor-pointer"
                                        >
                                            清除检索 x
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 空状态提示（当收藏夹为空时显示） */}
                        {showFavoritesOnly && currentData.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <HeartOutlineIcon className="w-16 h-16 mb-4 opacity-50" />
                                <p className="font-bold text-lg">小站没有找到收藏作品喔</p>
                                <p className="text-sm mt-2">点击心形图标即可收藏</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-8">
                            {currentData.map((item, index) => {
                                const originalTitle = getValue(item, ['原视频标题']) || '未知标题';
                                const translatedName = getValue(item, ['翻译视频标题(黑字熟肉红字生肉)']);
                                const displayTitle = (translatedName && translatedName !== '') ? translatedName : originalTitle;
                                const author = getValue(item, ['原视频作者']) || '未知原作者';
                                
                                const rawUploader = getValue(item, ['译者昵称', '译者', 'UP主昵称', '转载up主', 'UP主', '上传']) || '未知译者';
                                const uploader = rawUploader.replace(/(^|[^a-zA-Z])[(（\[{【\s]*uid[:：\s]*\d+[)）\]}】\s]*/gi, '$1').trim() || '未知译者';
                                
                                const publishDate = getValue(item, ['发布日期', '发布时间', '日期', '投稿时间', '投稿日期']);
                                const coverGradient = getAvatarGradient(originalTitle + index);
                                const avatarGradient = getAvatarGradient(uploader);
                                const uploaderFirstLetter = uploader !== '未知译者' ? uploader.substring(0, 1).toUpperCase() : '?';

                                const localCoverUrl = getValue(item, ['封面', '封面图', '封面链接', '海报']);
                                const isFav = favorites.includes(getItemUniqueKey(item));

                                return (
                                    <div 
                                        key={`card-${showFavoritesOnly}-${selectedUploader}-${page}-${searchTerm}-${index}`}
                                        className="video-card group cursor-pointer fade-in-active flex flex-col"
                                        style={{
                                            animationFillMode: 'both', 
                                            animationDelay: `${(index % itemsPerPage) * 0.04}s` 
                                        }}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 shadow-sm bg-gray-200">
                                            
                                            {localCoverUrl ? (
                                                <img 
                                                    src={localCoverUrl} 
                                                    alt="视频封面" 
                                                    loading="lazy" 
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => { e.target.style.display = 'none'; }} 
                                                />
                                            ) : (
                                                <div className={`video-cover absolute inset-0 bg-gradient-to-br ${coverGradient} opacity-80`}></div>
                                            )}

                                            {/* 卡片右上角的收藏按钮 */}
                                            <button 
                                                onClick={(e) => toggleFavorite(e, item)}
                                                className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                                                title={isFav ? "取消收藏" : "加入收藏"}
                                            >
                                                {isFav ? <HeartFilledIcon className="text-wata-pink" /> : <HeartOutlineIcon />}
                                            </button>
                                            
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                    <PlayIcon />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2.5 sm:gap-3 px-1">
                                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center text-white font-black text-xs sm:text-sm bg-gradient-to-br ${avatarGradient} shadow-sm border-2 border-white`}>
                                                {uploaderFirstLetter}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm sm:text-[15px] font-bold text-wata-dark leading-tight line-clamp-2 mb-1.5 group-hover:text-wata-pink transition-colors" title={displayTitle}>
                                                    {displayTitle}
                                                </h3>
                                                <div className="flex flex-col gap-1 text-[11px] sm:text-[12px] text-gray-500 font-semibold mt-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1 hover:text-wata-purple truncate max-w-[65%]" title={`译者/UP主: ${uploader}`}>
                                                            <UpIcon /> <span className="truncate leading-none pt-0.5">{uploader}</span>
                                                        </div>
                                                        {publishDate && (
                                                            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-400 shrink-0" title={`发布日期: ${publishDate}`}>
                                                                <DateIcon /> <span className="leading-none pt-0.5">{publishDate}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 hover:text-wata-pink truncate" title={`原作者: ${author}`}>
                                                        <AuthorIcon /> <span className="truncate leading-none pt-0.5">{author}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-10 sm:mt-12 gap-2 sm:gap-3 pb-8">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="h-9 px-3 sm:h-10 sm:px-4 rounded-full bg-white border-2 border-wata-lightPink text-wata-purple font-black disabled:opacity-50 hover:bg-wata-pink hover:text-white hover:border-wata-pink text-xs sm:text-sm shadow-sm transition-all cursor-pointer">
                                    上一页
                                </button>
                                
                                <div 
                                    className="h-9 px-3 sm:h-10 sm:px-5 rounded-full bg-gradient-to-r from-wata-pink to-wata-purple text-white font-black flex items-center shadow-wata text-xs sm:text-sm focus-within:ring-2 focus-within:ring-wata-pink/50 transition-all cursor-text" 
                                    title="点击输入页码直接跳转"
                                >
                                    <input
                                        type="number"
                                        min="1"
                                        max={totalPages}
                                        value={inputPage}
                                        onChange={(e) => setInputPage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') e.target.blur();
                                        }}
                                        onBlur={handleJumpPage}
                                        className="w-7 sm:w-9 bg-transparent text-center text-white outline-none placeholder:text-white/70 font-black focus:bg-white/20 rounded transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="mx-0.5 sm:mx-1 opacity-80 font-bold">/</span>
                                    <span className="opacity-80">{totalPages}</span>
                                </div>

                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-9 px-3 sm:h-10 sm:px-4 rounded-full bg-white border-2 border-wata-lightPink text-wata-purple font-black disabled:opacity-50 hover:bg-wata-pink hover:text-white hover:border-wata-pink text-xs sm:text-sm shadow-sm transition-all cursor-pointer">
                                    下一页
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* 导入表格引导弹窗 */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-wata-dark/40 backdrop-blur-sm transition-opacity" onClick={() => setShowUploadModal(false)}></div>
                    
                    <div className="modal-enter relative bg-white rounded-[24px] sm:rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-8 flex flex-col border-4 border-wata-lightPink">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl sm:text-2xl font-black title-font text-wata-dark">导入数据</h2>
                            <button onClick={() => setShowUploadModal(false)} className="text-gray-300 hover:text-wata-pink hover:rotate-90 bg-gray-50 hover:bg-wata-lightPink p-1.5 sm:p-2 rounded-full transition-all">
                                <CloseIcon />
                            </button>
                        </div>
                        
                        <div className="mb-6 space-y-3">
                            <div className="bg-wata-lightPink/30 p-4 rounded-xl text-sm font-bold text-wata-purple leading-relaxed">
                                <p>为了确保数据能被正确解析，请上传标准的 <span className="text-wata-pink">.csv</span> 格式表格文件。</p>
                            </div>
                            <ul className="text-xs sm:text-sm font-medium text-gray-500 space-y-2 pl-2">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-wata-pink"></span>
                                    <div>仅在小站未更新最新表格数据时使用，导入文件后将会在 <span className="underline decoration-dashed decoration-wata-purple decoration-2 underline-offset-4">您的浏览器本地</span> 覆盖新的数据。</div>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-wata-pink"></span>
                                    <div>请下载UP主 <a href="https://space.bilibili.com/1764312492" target="_blank" rel="noreferrer" className="text-wata-purple hover:text-wata-pink transition-colors underline underline-offset-4 decoration-wata-lightPink hover:decoration-wata-pink">敔信</a> 的最新统计表格，并将其转换为 <code className="bg-gray-100 px-1 rounded text-gray-700">.csv</code> 格式。</div>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-wata-pink"></span>
                                    <div>如使用 Excel/金山文档 导出，请在另存为时选择<span className="underline decoration-dashed decoration-wata-purple decoration-2 underline-offset-4">“导出为 CSV 文件”</span>。</div>
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-wata-pink"></span>
                                    <div>如果导入后没有显示封面是<span className="text-wata-pink font-bold">正常的</span>，因为原表格不包含封面数据。</div>
                                </li>
                            </ul>
                        </div>

                        <label className="border-2 border-dashed border-wata-lightPink hover:border-wata-pink bg-wata-bg/30 hover:bg-wata-lightPink/20 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                            <div className="text-wata-purple group-hover:text-wata-pink group-hover:scale-110 transition-transform duration-300 mb-4">
                                <FileUploadBigIcon />
                            </div>
                            <span className="text-sm sm:text-base font-black text-wata-dark group-hover:text-wata-pink transition-colors">
                                点击此处选择 CSV 文件
                            </span>
                            <span className="text-xs font-bold text-gray-400 mt-2">
                                支持直接覆盖当前数据
                            </span>
                            <input 
                                type="file" 
                                accept=".csv" 
                                onChange={handleFileUpload} 
                                className="hidden" 
                            />
                        </label>
                    </div>
                </div>
            )}

            {/* 详情弹窗 */}
            {selectedItem && (() => {
                const translatedName = getValue(selectedItem, ['译名', '中文名', '译文标题', '翻译', '中文']);
                const originalTitle = getValue(selectedItem, ['原视频标题', '视频标题', '日文标题', '原标题']);
                const modalMainTitle = (translatedName && translatedName !== '') ? translatedName : (originalTitle || '详情信息');
                
                let biliLink = getValue(selectedItem, ['翻译视频链接', 'bilibili', 'b站', '哔哩', '转载链接', 'bilibili链接']);
                let origLink = getValue(selectedItem, ['原视频链接', '原本链接', '原链接', '油管', 'youtube', 'twitter', '推特', '源链接']);
                
                if (origLink && (origLink.includes('bilibili.com') || origLink.includes('b23.tv'))) { if (!biliLink) { biliLink = origLink; origLink = ''; } }
                if (biliLink && (biliLink.includes('youtube.com') || biliLink.includes('twitter.com'))) { if (!origLink) { origLink = biliLink; biliLink = ''; } }
                if (biliLink && origLink && biliLink === origLink) origLink = '';

                // 判断弹窗中的项是否已收藏
                const isItemFav = favorites.includes(getItemUniqueKey(selectedItem));

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
                        <div className="absolute inset-0 bg-wata-dark/40 backdrop-blur-sm" onClick={() => setSelectedItem(null)}></div>
                        
                        <div className="modal-enter relative bg-white rounded-[24px] sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden border-4 border-wata-lightPink">
                            <div className="h-2 sm:h-4 bg-gradient-to-r from-wata-pink via-wata-purple to-wata-cyan w-full shrink-0"></div>
                            
                            {/* --- 恢复：顶部只保留关闭按钮 --- */}
                            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-100 flex justify-between items-start relative shrink-0">
                                <div className="pr-10 w-full">
                                    <h2 className="text-lg sm:text-2xl font-black title-font text-wata-dark mb-1 whitespace-normal break-words leading-snug">
                                        {modalMainTitle}
                                    </h2>
                                </div>
                                <button onClick={() => setSelectedItem(null)} className="absolute right-3 top-3 sm:right-5 sm:top-5 text-gray-300 hover:text-wata-pink hover:rotate-90 bg-gray-50 hover:bg-wata-lightPink p-1.5 sm:p-2 rounded-full transition-all cursor-pointer">
                                    <CloseIcon />
                                </button>
                            </div>
                            
                            <div className="px-4 py-4 sm:px-6 sm:py-6 overflow-y-auto flex-grow bg-wata-bg/30">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                    {tableHeaders.map((key) => {
                                        const value = selectedItem[key];
                                        if (!value || typeof value !== 'string' || value.trim() === '') return null;
                                        
                                        if (key === '译者（UID）排名不分先后' || key === '进度' || key === '授权' || key === '序号') return null;
                                        
                                        const lowerKey = key.toLowerCase();
                                        if (['翻译视频标题(黑字熟肉红字生肉)', '封面'].some(k => lowerKey.includes(k))) return null;
                                        if (value.trim() === modalMainTitle) return null;
                                        if (lowerKey.includes('序号')) return null;

                                        const isLink = value.startsWith('http');
                                        const isLongText = value.length > 40 || key.includes('简介') || key.includes('说明') || isLink;
                                        const isImportantKey = lowerKey.includes('作者') || lowerKey.includes('up主') || lowerKey.includes('标题');

                                        return (
                                            <div key={key} className={`${isLongText ? 'md:col-span-2' : 'md:col-span-1'} bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-transparent hover:border-wata-lightPink shadow-sm transition-colors`}>
                                                <dt className="text-[10px] sm:text-xs font-black text-wata-purple mb-1 sm:mb-1.5 uppercase tracking-wider">{key}</dt>
                                                <dd className={`text-xs sm:text-sm ${isImportantKey ? 'font-black text-wata-dark' : 'font-bold text-gray-600'} break-all whitespace-pre-wrap`}>
                                                    {isLink ? (
                                                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-wata-pink hover:text-[#ff85a8] hover:underline select-all">{value}</a>
                                                    ) : (
                                                        <span className="select-text">{value}</span>
                                                    )}
                                                </dd>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
                                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-3">
                                    <button 
                                        onClick={(e) => toggleFavorite(e, selectedItem)} 
                                        className={`flex items-center justify-center gap-2 px-6 py-2.5 font-black rounded-full transition-all duration-300 hover:scale-105 cursor-pointer border-2 ${isItemFav ? 'bg-wata-pink/10 text-wata-pink border-wata-pink/30' : 'bg-white text-gray-500 border-gray-200 hover:text-wata-pink hover:border-wata-pink/50'}`}
                                    >
                                        {isItemFav ? <HeartFilledIcon /> : <HeartOutlineIcon />}
                                        {isItemFav ? '已收藏' : '收藏'}
                                    </button>

                                    {origLink && (
                                        <a href={origLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-2.5 bg-wata-purple text-white font-black rounded-full transition-all duration-300 shadow-wata hover:shadow-wata-hover hover:scale-105 cursor-pointer border-2 border-transparent">
                                            <JumpLinkIcon /> 原视频
                                        </a>
                                    )}
                                    {biliLink && (
                                        <a href={biliLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#fb7299] text-white font-black rounded-full transition-all duration-300 shadow-wata hover:shadow-wata-hover hover:scale-105 cursor-pointer border-2 border-transparent">
                                            <BiliIcon /> 翻译视频
                                        </a>
                                    )}
                                    {(!biliLink && !origLink) && (
                                        <button onClick={() => setSelectedItem(null)} className="px-8 py-2 sm:py-2.5 bg-gray-200 text-gray-600 font-black rounded-full hover:bg-gray-300 text-sm border-2 border-transparent">
                                            关闭
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {showAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-wata-dark/40 backdrop-blur-sm transition-opacity" onClick={closeAnnouncement}></div>
                    <div className="modal-enter relative bg-white rounded-[24px] sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] p-6 sm:p-8 flex flex-col border-4 border-wata-lightPink">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl sm:text-2xl font-black text-wata-dark">更新公告</h2>
                            <button onClick={closeAnnouncement} className="text-gray-300 hover:text-wata-pink hover:rotate-90 bg-gray-50 hover:bg-wata-lightPink p-1.5 sm:p-2 rounded-full transition-all cursor-pointer">
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="mb-8 space-y-4 text-sm font-medium text-gray-600 leading-relaxed overflow-y-auto pr-2">
                            <p>欢迎来到 <span className="font-bold text-wata-purple">biliVManga</span>！本次更新内容如下：</p>
                            <ul className="space-y-2 pl-2 max-h-full overflow-y-auto">
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-wata-pink mt-1.5 shrink-0"></span>
                                    <span>添加了视频收藏功能，通过点击视频封面右上角的 ♥ 形按钮，或者在视频详情页面中点击收藏按钮，即可在浏览器本地收藏视频（但更换浏览器、删除本地缓存数据后会被清除，敬请注意）；</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-wata-pink mt-1.5 shrink-0"></span>
                                    <span>添加了汉化UP主列表，通过点击“快速探索”中的“UP主列表”即可预览；</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-wata-pink mt-1.5 shrink-0"></span>
                                    <span>优化了表格搜索，现在标题为空的视频不会被网页读取（默认标题为空的视频为被删除视频）。</span>
                                </li>
                            </ul>
                            <p className="pt-2 text-xs text-gray-400"><br />更新日期：2026/03/29</p>
                        </div>
                        <button onClick={closeAnnouncement} className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-wata-pink to-wata-purple text-white font-black rounded-full hover:shadow-wata-hover hover:scale-105 transition-all duration-300 cursor-pointer">
                            我知道啦
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}