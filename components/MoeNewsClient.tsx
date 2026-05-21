'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ScheduleTab } from './ScheduleTab';
import { NewsItem } from '@/app/api/news/route';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Heart, Newspaper, Filter, SlidersHorizontal, ArrowUpRight, TrendingUp, Home, ArrowLeft } from 'lucide-react';

interface MoeNewsClientProps {
  initialNews: NewsItem[];
  serverFallback: boolean;
}

interface CategoryItem {
  id: string;
  label: string;
  icon: string;
}

interface CategoryGroup {
  groupName: string;
  items: CategoryItem[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    groupName: 'KHÁM PHÁ THẾ GIỚI 2D 🌟',
    items: [
      { id: 'goc-anime', label: 'Góc Anime', icon: '🎬' },
      { id: 'goc-manga', label: 'Góc Manga', icon: '📖' },
      { id: 'goc-game', label: 'Góc Game', icon: '🎮' },
      { id: 'goc-hoat-hinh', label: 'Góc Hoạt hình', icon: '🦄' },
      { id: 'live-action', label: 'Live-action', icon: '🎭' },
      { id: 'vtuber', label: 'Vtuber', icon: '✨' },
      { id: 'truyen-sach', label: 'Truyện & Sách', icon: '📚' }
    ]
  },
  {
    groupName: 'CỘNG ĐỒNG 👥',
    items: [
      { id: 'thuyet-am-muu-va-spoiler', label: 'Thuyết âm mưu & Spoiler', icon: '🕵️' },
      { id: 'bang-xep-hang', label: 'Thành tựu', icon: '🏆' },
      { id: 'cong-dong', label: 'Cộng đồng', icon: '💬' },
      { id: 'thong-bao', label: 'Thông báo', icon: '📢' }
    ]
  },
  {
    groupName: 'ĐỊNH DẠNG 📱',
    items: [
      { id: 'reel', label: 'Reel', icon: '⚡' }
    ]
  }
];

export const MoeNewsClient: React.FC<MoeNewsClientProps> = ({ initialNews, serverFallback }) => {
  // Feed segmentations
  const [spotlightNews, setSpotlightNews] = useState<NewsItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>(initialNews);
  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([]);
  
  const [bookmarks, setBookmarks] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'bookmarks' | 'schedule'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(true);
  const [fallbackUsed, setFallbackUsed] = useState(serverFallback);

  const fetchNews = async (query: string = '', categorySlug: string = 'all') => {
    try {
      setLoading(true);
      let url = '/api/news';
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (categorySlug && categorySlug !== 'all') params.set('category', categorySlug);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Không thể tải tin tức mới nhất');
      const data = await res.json();
      
      if (data.success) {
        setSpotlightNews(data.spotlight || []);
        setLatestNews(data.latest || []);
        if (data.trending && data.trending.length > 0) {
          setTrendingNews(data.trending);
        }
        setFallbackUsed(data.fallback || false);

        // Tự động mở bài viết từ tham số URL nếu tìm thấy trong kết quả tải về
        const urlParams = new URLSearchParams(window.location.search);
        const postSlug = urlParams.get('post');
        if (postSlug) {
          const allPosts = [...(data.spotlight || []), ...(data.latest || []), ...(data.trending || [])];
          const found = allPosts.find(p => p.slug === postSlug);
          if (found) {
            setSelectedNews(found);
          }
        }
      }
    } catch (error) {
      console.error('Không thể đồng bộ dữ liệu thời gian thực:', error);
      setFallbackUsed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (query: string) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (query) {
        url.searchParams.set('q', query);
      } else {
        url.searchParams.delete('q');
      }
      window.history.pushState(null, '', url.toString());
    }
    fetchNews(query, selectedCategory);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (categoryId && categoryId !== 'all') {
        url.searchParams.set('category', categoryId);
      } else {
        url.searchParams.delete('category');
      }
      window.history.pushState(null, '', url.toString());
    }
    
    fetchNews(searchQuery, categoryId);
  };

  const handleOpenNews = (item: NewsItem) => {
    setSelectedNews(item);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('post', item.slug);
      window.history.pushState(null, '', url.toString());
    }
  };

  const handleCloseNews = () => {
    setSelectedNews(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('post');
      window.history.pushState(null, '', url.toString());
    }
  };

  // Fetch real segmented news from API on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q') || '';
    const initialCategory = urlParams.get('category') || 'all';
    const initialPost = urlParams.get('post') || '';
    
    setSearchQuery(initialQuery);
    setSelectedCategory(initialCategory);
    
    // Nếu có bài viết từ SSR phù hợp, mở ngay lập tức để tăng độ mượt mà!
    if (initialPost && initialNews) {
      const found = initialNews.find(p => p.slug === initialPost);
      if (found) {
        setSelectedNews(found);
      }
    }
    
    fetchNews(initialQuery, initialCategory);
  }, []);

  // Load bookmarks on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('moenews_bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
    // Always default to cream background theme synchronized with Tani
    setTheme('light');
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const toggleTheme = () => {
    // Keep synchronized with Tani's constant light theme background
    setTheme('light');
  };

  // Toggle bookmark helper
  const handleToggleBookmark = (item: NewsItem) => {
    const isAlreadyBookmarked = bookmarks.some(b => b.url === item.url);
    let updated: NewsItem[] = [];
    if (isAlreadyBookmarked) {
      updated = bookmarks.filter(b => b.url !== item.url);
    } else {
      updated = [item, ...bookmarks];
    }
    setBookmarks(updated);
    localStorage.setItem('moenews_bookmarks', JSON.stringify(updated));
  };

  // Filter and search feed
  const getProcessedFeed = () => {
    let baseList: NewsItem[] = [];
    if (activeTab === 'feed') {
      if (searchQuery) {
        // Combine all loaded feed items so that search covers all spotlight, latest, and trending articles!
        const allLoaded = [...spotlightNews, ...latestNews, ...trendingNews];
        const unique = new Map<string, NewsItem>();
        allLoaded.forEach(item => {
          if (item && item.slug) {
            unique.set(item.slug, item);
          }
        });
        baseList = Array.from(unique.values());
      } else {
        baseList = latestNews;
      }
    } else {
      baseList = bookmarks;
    }
    
    return baseList
      .filter(item => {
        if (!item || !item.title) return false;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        return sortBy === 'newest' ? 0 : -1;
      });
  };

  const processedFeed = getProcessedFeed();

  // Spotlight layout separation
  const mainSpotlight = spotlightNews[0] || latestNews[0];
  const secondarySpotlight = spotlightNews.slice(1, 4);

  const getRankColor = (index: number) => {
    if (index === 0) return 'bg-[#5720D4] text-white';
    if (index === 1) return 'bg-[var(--accent-yellow)] text-[#311B56]';
    if (index === 2) return 'bg-[var(--accent-green)] text-white';
    return 'bg-zinc-200 text-[#311B56]';
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAF8F5] text-[#311B56] font-sans overflow-x-hidden">
      
      {/* 🧭 LEFT SIDEBAR - Perfectly Synced with Tani */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        bookmarkCount={bookmarks.length}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 💻 MAIN PANEL CONTAINER */}
      <main className="ml-[100px] max-lg:ml-0 flex-1 flex flex-col min-h-screen relative w-[calc(100%-100px)] max-lg:w-full max-lg:pb-[100px]">
        
        {/* 🏷️ HEAD BAR - Synced with Tani */}
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          fallbackUsed={fallbackUsed}
          theme={theme}
          toggleTheme={toggleTheme}
          bookmarkCount={bookmarks.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* 📚 MAIN CONTENT INNER LAYOUT */}
        <div className="pt-[110px] px-6 md:px-10 pb-[80px] max-w-[1500px] mx-auto w-full flex flex-col gap-6 overflow-x-hidden">
          
          {/* Dashboard Title & Meta Panel - Matched layout grid */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between border-2 border-[#311B56] bg-[var(--accent-purple)] p-6 shadow-[4px_4px_0px_#311B56]">
            <div className="select-none">
              <span className="text-[10px] font-black bg-white text-[#311B56] px-3 py-1 border-2 border-[#311B56] uppercase tracking-wider mb-2.5 inline-block shadow-[2px_2px_0px_#311B56] font-mono">
                {activeTab === 'feed' ? '[ NEWS FEED PORTAL ]' : activeTab === 'schedule' ? '[ AIRING SCHEDULE ]' : '[ PERSONAL NEWS VAULT ]'}
              </span>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white drop-shadow-[2px_2px_0px_#311B56]">
                {activeTab === 'feed' ? 'MoeNews Dashboard 📰' : activeTab === 'schedule' ? 'Lịch Chiếu Anime 📅' : 'Tin Tức Đã Lưu 💖'}
              </h1>
            </div>
            
            <div className="mt-4 lg:mt-0 flex flex-wrap items-center gap-3">
              {activeTab === 'feed' && (
                <span className="text-[10px] font-black bg-[var(--accent-yellow)] text-[#311B56] border-2 border-[#311B56] px-3 py-1.5 shadow-[2px_2px_0px_#311B56] uppercase select-none font-mono">
                  [ Scraper v1.2 ]
                </span>
              )}
              {activeTab !== 'schedule' && (
                <span className="text-[10px] font-black bg-white text-[#311B56] border-2 border-[#311B56] px-3 py-1.5 shadow-[2px_2px_0px_#311B56] uppercase select-none font-mono">
                  [ COUNT: {processedFeed.length} ]
                </span>
              )}
            </div>
          </div>

          {/* 📅 TAB VIEW ROUTING */}
          {activeTab === 'schedule' ? (
            <ScheduleTab />
          ) : (
            <>
              {/* ⚡ SPOTLIGHT HERO SECTION */}
              {activeTab === 'feed' && !searchQuery && selectedCategory === 'all' && mainSpotlight && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 select-none">
                    <span className="text-[10px] font-black uppercase bg-[var(--accent-pink)] text-[#311B56] px-3 py-1 border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] tracking-wider font-mono">
                      [ HOT TRENDING 🔥 ]
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Big Spotlight Hero Card - Syced premium hover and border */}
                    <motion.a
                      href={`/news/${mainSpotlight.slug}`}
                      className="lg:col-span-8 flex flex-col border-2 border-[#311B56] bg-white p-5 shadow-[4px_4px_0px_#311B56] hover:-translate-y-1.5 hover:-translate-x-1.5 hover:shadow-[8px_8px_0px_#311B56] transition-all duration-300 group cursor-pointer decoration-transparent block"
                      whileHover={{ scale: 1.002 }}
                    >
                      <div className="relative w-full aspect-[21/9] border-2 border-[#311B56] overflow-hidden bg-[#FAF8F5] mb-4">
                        <img
                          src={mainSpotlight.image}
                          alt={mainSpotlight.title}
                          className="w-full h-full object-cover grayscale-[3%] contrast-[1.1] transition-transform duration-500 group-hover:scale-[1.03]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://picsum.photos/800/400?random=spotlight';
                          }}
                        />
                        <span className="absolute top-2.5 left-2.5 bg-[var(--accent-purple)] text-white border-2 border-[#311B56] text-[9px] font-black px-2.5 py-1 uppercase shadow-[2px_2px_0px_#311B56] select-none font-mono">
                          [ SPOTLIGHT HERO ]
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2 select-none">
                        <Calendar size={12} className="text-[#311B56]" />
                        <span className="text-[10px] font-black text-[var(--accent-purple)] uppercase tracking-wider font-mono">
                          {mainSpotlight.date || 'Mới cập nhật'}
                        </span>
                      </div>

                      <h2 className="text-xl md:text-2xl font-black text-[#311B56] leading-tight uppercase mb-3 group-hover:underline decoration-wavy decoration-2">
                        {mainSpotlight.title}
                      </h2>

                      {mainSpotlight.excerpt && (
                        <p className="text-xs font-bold text-[#311B56]/70 line-clamp-2 leading-relaxed mb-4 border-l-4 border-[var(--accent-purple)] pl-3">
                          {mainSpotlight.excerpt}
                        </p>
                      )}
                    </motion.a>

                    {/* Secondary Spotlight Stack */}
                    <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
                      {secondarySpotlight.map((item, idx) => (
                        <motion.a
                          key={idx}
                          href={`/news/${item.slug}`}
                          className="flex-1 flex gap-3 p-3.5 border-2 border-[#311B56] bg-white shadow-[4px_4px_0px_#311B56] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_#311B56] transition-all duration-300 group cursor-pointer decoration-transparent block"
                          whileHover={{ scale: 1.005 }}
                        >
                          <div className="relative w-24 h-full min-h-[80px] shrink-0 border-2 border-[#311B56] overflow-hidden bg-[#FAF8F5]">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://picsum.photos/150/100?random=${idx + 40}`;
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <span className="text-[8px] font-black text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 px-1.5 py-0.5 uppercase tracking-wider mb-1 inline-block select-none font-mono">
                                [ FLASH #{idx + 2} ]
                              </span>
                              <h3 className="font-extrabold text-[11px] text-[#311B56] line-clamp-2 leading-tight uppercase group-hover:underline">
                                {item.title}
                              </h3>
                            </div>
                            {item.date && (
                              <span className="text-[9px] font-bold opacity-60 mt-1 block uppercase font-mono">
                                {item.date}
                              </span>
                            )}
                          </div>
                        </motion.a>
                      ))}
                    </div>

                  </div>
                </div>
              )}

              {/* ⚙️ KHÁM PHÁ TRẠM ANIME - NEO-BRUTALIST PREMIUM BOX */}
              {activeTab === 'feed' && (
                <div className="border-2 border-[#311B56] bg-white p-6 shadow-[4px_4px_0px_#311B56] flex flex-col gap-6 relative select-none">
                  {/* Title & All-reset button */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#311B56]/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 bg-[var(--accent-purple)] border border-[#311B56] animate-pulse"></div>
                      <h2 className="text-lg font-black uppercase tracking-tight text-[#311B56]">
                        Khám phá Trạm Anime
                      </h2>
                    </div>
                    
                    <button
                      onClick={() => handleCategorySelect('all')}
                      className={`px-4 py-2 border-2 text-xs font-black uppercase transition-all shadow-[2px_2px_0px_#311B56] brutal-btn-active flex items-center gap-2
                        ${selectedCategory === 'all'
                          ? 'bg-[#311B56] text-[#FAF8F5] border-[#311B56]'
                          : 'bg-transparent border-[#311B56] text-[#311B56] hover:bg-[var(--accent-purple)]/10'
                        }`}
                    >
                      <span>🏠 Tất cả tin tức</span>
                    </button>
                  </div>

                  {/* Category Groups Stack */}
                  <div className="space-y-5">
                    {CATEGORY_GROUPS.map((group, groupIdx) => (
                      <div key={groupIdx} className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#311B56]/50">
                          {group.groupName}
                        </span>
                        
                        <div className="flex flex-wrap items-center gap-2.5">
                          {group.items.map(item => (
                            <button
                              key={item.id}
                              onClick={() => handleCategorySelect(item.id)}
                              className={`px-4 py-2 border-2 text-xs font-bold transition-all shadow-[2px_2px_0px_#311B56] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#311B56] brutal-btn-active flex items-center gap-2
                                ${selectedCategory === item.id
                                  ? 'bg-[var(--accent-purple)] text-white border-[#311B56]'
                                  : 'bg-[#FAF8F5] border-[#311B56]/50 text-[#311B56] hover:border-[#311B56] hover:bg-white'
                                }`}
                            >
                              <span>{item.icon}</span>
                              <span className="font-extrabold uppercase">{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🔍 FILTER & SORT SELECTOR TABS */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-2 border-[#311B56] bg-white p-4 shadow-[4px_4px_0px_#311B56] select-none">
                
                {/* Active Category Meta display */}
                <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-[#311B56]/70 ml-1">
                  <SlidersHorizontal size={14} className="text-[#311B56]" />
                  <span>[ CHUYÊN MỤC: {selectedCategory === 'all' ? 'TẤT CẢ TIN TỨC' : selectedCategory.replace(/-/g, ' ')} ]</span>
                </div>

                {/* Sorting mechanism */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-2 border-[#311B56] px-3 py-1.5 text-xs font-black uppercase outline-none shadow-[2px_2px_0px_#311B56] font-mono"
                  >
                    <option value="newest" className="bg-white text-[#311B56]">Mới nhất</option>
                    <option value="oldest" className="bg-white text-[#311B56]">Cũ hơn</option>
                  </select>
                </div>

              </div>

              {/* 🫙 DYNAMIC FEED CONTAINER */}
              {processedFeed.length === 0 ? (
                
                <div className="flex flex-col items-center justify-center p-16 border-2 border-[#311B56] bg-white shadow-[4px_4px_0px_#311B56] max-w-xl mx-auto w-full text-center">
                  <Newspaper size={56} className="text-[var(--accent-purple)] mb-4 animate-cute-bounce" />
                  <h2 className="text-xl font-black uppercase text-[#311B56] mb-2">Trống trơn rồi!</h2>
                  <p className="text-xs font-bold text-[#311B56]/70 max-w-sm leading-relaxed mb-6">
                    Không tìm thấy bài viết nào phù hợp với bộ lọc tìm kiếm. Thử chuyển đổi danh mục hoặc gõ từ khóa khác xem sao nhé!
                  </p>
                  <button 
                    onClick={() => { setSelectedCategory('all'); setSearchQuery(''); handleSearchSubmit(''); }}
                    className="px-5 py-2.5 bg-[var(--accent-purple)] border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] font-black text-xs text-white uppercase brutal-btn-active font-mono"
                  >
                    [ RESET FILTER ]
                  </button>
                </div>

              ) : (

                /* FEED LEFT COLUMN + TRENDING RIGHT COLUMN */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* FEED GRID CARDS */}
                  <div className="lg:col-span-8 space-y-5">
                    <div className="flex items-center gap-2 select-none mb-1">
                      <span className="text-[10px] font-black uppercase bg-[var(--accent-purple)] text-white px-3 py-1 border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] tracking-wider font-mono">
                        {activeTab === 'feed' ? '[ LATEST NEWSFEED 📰 ]' : '[ BOOKMARKS VAULT 💖 ]'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {loading ? (
                        // 🌀 SKELETON LOADING GRID
                        Array.from({ length: 6 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col border-2 border-[#311B56]/30 bg-white p-4 shadow-[4px_4px_0px_rgba(49,27,86,0.15)] animate-pulse"
                          >
                            <div className="relative w-full aspect-video border-2 border-[#311B56]/20 bg-[#FAF8F5] mb-3 shrink-0"></div>
                            <div className="h-3 bg-zinc-200 rounded w-1/3 mb-2"></div>
                            <div className="h-5 bg-zinc-200 rounded w-full mb-2"></div>
                            <div className="h-5 bg-zinc-200 rounded w-4/5 mb-3"></div>
                            <div className="h-3 bg-zinc-100 rounded w-full mt-2"></div>
                          </div>
                        ))
                      ) : (
                        processedFeed.map((item, idx) => (
                        <motion.a
                          key={idx}
                          href={`/news/${item.slug}`}
                          className="flex flex-col border-2 border-[#311B56] bg-white p-4 shadow-[4px_4px_0px_#311B56] hover:-translate-y-1.5 hover:-translate-x-1.5 hover:shadow-[6px_6px_0px_#311B56] transition-all duration-300 group cursor-pointer relative decoration-transparent block"
                          whileHover={{ scale: 1.002 }}
                        >
                          {/* Image box */}
                          <div className="relative w-full aspect-video border-2 border-[#311B56] overflow-hidden bg-[#FAF8F5] mb-3 shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover grayscale-[5%] contrast-[1.1] transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://picsum.photos/400/220?random=${idx + 20}`;
                              }}
                            />
                            
                            {/* Category tag */}
                            <span className="absolute top-2 left-2 text-[8px] font-black bg-[var(--accent-yellow)] text-[#311B56] border border-[#311B56] px-2 py-0.5 uppercase shadow-[1px_1px_0px_#311B56] select-none font-mono">
                              [ {item.category || 'Anime'} ]
                            </span>
                          </div>

                          {/* Meta date */}
                          {item.date && (
                            <span className="text-[9px] font-black text-[var(--accent-pink)] uppercase tracking-wider mb-1 block select-none font-mono">
                              {item.date}
                            </span>
                          )}

                          {/* Title */}
                          <h3 className="font-black text-sm text-[#311B56] leading-snug uppercase group-hover:underline decoration-wavy line-clamp-2">
                            {item.title}
                          </h3>

                          {/* Excerpt */}
                          {item.excerpt && (
                            <p className="text-[11px] font-bold text-[#311B56]/60 line-clamp-2 mt-2 leading-normal">
                              {item.excerpt}
                            </p>
                          )}
                          {/* Quick bookmark action */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#311B56]/10 select-none">
                            <span className="text-[9px] font-black uppercase text-[var(--accent-purple)] group-hover:underline flex items-center gap-1 font-mono">
                              [ READ ARTICLE ] <ArrowUpRight size={10} />
                            </span>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleToggleBookmark(item);
                              }}
                              className={`w-7 h-7 border border-[#311B56] flex items-center justify-center shadow-[1px_1px_0px_#311B56] brutal-btn-active ${bookmarks.some(b => b.url === item.url) ? 'bg-[var(--accent-pink)] text-[#311B56]' : 'bg-white text-[#311B56]'}`}
                            >
                              <Heart size={12} className={bookmarks.some(b => b.url === item.url) ? 'fill-current text-[#8C52FF]' : ''} />
                            </button>
                          </div>

                        </motion.a>
                      ))
                    )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: TRENDING */}
                  <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-[110px]">
                    <div className="flex items-center gap-2 select-none mb-1">
                      <span className="text-[10px] font-black uppercase bg-[var(--accent-pink)] text-[#311B56] px-3 py-1 border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] tracking-wider flex items-center gap-1.5 font-mono">
                        <TrendingUp size={14} /> [ TRENDING MATRIX 📈 ]
                      </span>
                    </div>

                    <div className="border-2 border-[#311B56] bg-white p-4 shadow-[4px_4px_0px_#311B56] divide-y-2 divide-[#311B56]/10">
                      {trendingNews.length > 0 ? (
                        trendingNews.map((item, idx) => (
                          <motion.a
                            key={idx}
                            href={`/news/${item.slug}`}
                            className="flex items-center gap-3.5 py-3.5 group cursor-pointer first:pt-1 last:pb-1 decoration-transparent block"
                            whileHover={{ x: 2 }}
                          >
                            {/* Rank number */}
                            <div className={`w-8 h-8 shrink-0 border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] flex items-center justify-center text-xs font-black select-none ${getRankColor(idx)}`}>
                              {(idx + 1).toString().padStart(2, '0')}
                            </div>

                            {/* Title */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-extrabold text-[11px] text-[#311B56] leading-snug uppercase tracking-tight group-hover:text-[var(--accent-purple)] group-hover:underline line-clamp-2">
                                {item.title}
                              </h4>
                            </div>

                            {/* Image avatar */}
                            {item.image && (
                              <div className="w-10 h-10 shrink-0 border border-[#311B56] overflow-hidden bg-zinc-100 shadow-[1px_1px_0px_#311B56]">
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            )}

                          </motion.a>
                        ))
                      ) : (
                        <div className="p-8 text-center text-xs font-bold opacity-50 select-none">
                          Chưa có dữ liệu xu hướng
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              )}
            </>
          )}

        </div>

      </main>

      {/* 📱 PORTABLE FLOATING BOTTOM NAV - Perfectly synced with Tani's BottomNav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] h-[64px] bg-[#FAF8F5] border-2 border-[#311B56] shadow-[4px_4px_0px_#311B56] z-[900] flex items-center justify-around px-2 lg:hidden">
        {/* Home/Feed Navigation */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`w-11 h-11 flex items-center justify-center rounded-none border-2 transition-all duration-300 relative group brutal-btn-active ${
            activeTab === 'feed'
              ? 'bg-[#311B56] text-[#FAF8F5] border-[#311B56] translate-y-[-2px] shadow-[2px_2px_0px_#311B56]'
              : 'text-[#311B56] border-[#311B56] hover:bg-[#311B56]/10'
          }`}
        >
          <Home size={20} className={`relative z-10 transition-transform ${activeTab === 'feed' ? 'scale-110 fill-current' : 'group-hover:scale-110'}`} />
        </button>

        {/* Schedule Navigation */}
        <button
          onClick={() => setActiveTab('schedule')}
          className={`w-11 h-11 flex items-center justify-center rounded-none border-2 transition-all duration-300 relative group brutal-btn-active ${
            activeTab === 'schedule'
              ? 'bg-[#10B981] text-white border-[#10B981] translate-y-[-2px] shadow-[2px_2px_0px_#10B981]'
              : 'text-[#10B981] border-[#10B981] hover:bg-[#10B981]/10'
          }`}
        >
          <Calendar size={20} className={`relative z-10 transition-transform ${activeTab === 'schedule' ? 'scale-110 fill-current' : 'group-hover:scale-110'}`} />
        </button>

        {/* Bookmarks Navigation */}
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`w-11 h-11 flex items-center justify-center rounded-none border-2 transition-all duration-300 relative group brutal-btn-active ${
            activeTab === 'bookmarks'
              ? 'bg-[var(--accent-pink)] text-[#311B56] border-[#311B56] translate-y-[-2px] shadow-[2px_2px_0px_#311B56]'
              : 'text-[#311B56] border-[#311B56] hover:bg-[#311B56]/10'
          }`}
        >
          <Heart size={20} className={`relative z-10 transition-transform ${activeTab === 'bookmarks' ? 'scale-110 fill-current text-[#8C52FF]' : 'group-hover:scale-110'}`} />
          {bookmarks.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent-yellow)] text-[#311B56] border border-[#311B56] text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center shadow-[1px_1px_0px_#311B56]">
              {bookmarks.length}
            </span>
          )}
        </button>

        {/* Home Tani Space-Jump */}
        <a
          href="http://localhost:3000"
          className="w-11 h-11 flex items-center justify-center rounded-none border-2 text-[#311B56] border-[#311B56] hover:bg-[#311B56]/10"
        >
          <ArrowLeft size={20} />
        </a>
      </div>

    </div>
  );
};
