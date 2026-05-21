'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, User, Heart, Share2, ExternalLink, RefreshCw, Home, ArrowLeft, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsItem {
  title: string;
  url: string;
  slug: string;
  image: string;
  date?: string;
  excerpt?: string;
  category?: string;
}

interface NewsDetailClientProps {
  initialArticle: {
    title: string;
    image: string;
    date: string;
    category: string;
    html: string;
    slug: string;
  };
}

export const NewsDetailClient: React.FC<NewsDetailClientProps> = ({ initialArticle }) => {
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [bookmarks, setBookmarks] = useState<NewsItem[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load bookmarks on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('moenews_bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    // Fetch trending news for the right sidebar
    async function fetchTrending() {
      try {
        setLoadingTrending(true);
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.trending) {
            setTrendingNews(data.trending.slice(0, 8)); // Lấy top 8 tin nóng
          }
        }
      } catch (err) {
        console.error('Lỗi tải tin trending:', err);
      } finally {
        setLoadingTrending(false);
      }
    }
    fetchTrending();
  }, []);

  const isBookmarked = bookmarks.some(b => b.slug === initialArticle.slug);

  const handleToggleBookmark = () => {
    let updated: NewsItem[] = [];
    const itemToSave: NewsItem = {
      title: initialArticle.title,
      url: `https://tramanime.com/post/${initialArticle.slug}`,
      slug: initialArticle.slug,
      image: initialArticle.image,
      date: initialArticle.date,
      category: initialArticle.category
    };

    if (isBookmarked) {
      updated = bookmarks.filter(b => b.slug !== initialArticle.slug);
    } else {
      updated = [...bookmarks, itemToSave];
    }
    setBookmarks(updated);
    localStorage.setItem('moenews_bookmarks', JSON.stringify(updated));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/news/${initialArticle.slug}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getTextSizeClass = () => {
    if (textSize === 'sm') return 'text-xs';
    if (textSize === 'base') return 'text-sm';
    if (textSize === 'lg') return 'text-base';
    return 'text-lg';
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#311B56] flex flex-col">
      
      {/* 🧭 TOP PREMIUM HEADER BAR */}
      <header className="h-[75px] border-b-4 border-[#311B56] px-4 md:px-8 flex items-center justify-between bg-white sticky top-0 z-[100] shadow-[0_4px_0px_#311B56]/5">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="h-10 px-3.5 border-2 border-[#311B56] bg-[var(--accent-yellow)] text-[#311B56] font-black text-xs uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#311B56] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_#311B56] transition-all font-mono select-none"
          >
            <ArrowLeft size={14} /> [ TRANG CHỦ ]
          </a>
          
          <span className="hidden sm:inline-block text-[10px] font-black tracking-widest bg-[var(--accent-purple)] text-white px-2 py-0.5 border border-[#311B56] uppercase font-mono">
            [ MOENEWS READER 📖 ]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Text Size buttons */}
          <div className="flex items-center border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] bg-white h-10 select-none">
            <button
              onClick={() => {
                if (textSize === 'xl') setTextSize('lg');
                else if (textSize === 'lg') setTextSize('base');
                else if (textSize === 'base') setTextSize('sm');
              }}
              className="w-8 h-full border-r-2 border-[#311B56] flex items-center justify-center font-black text-xs hover:bg-[var(--accent-purple)]/10 brutal-btn-active text-[#311B56]"
              title="Thu nhỏ chữ"
            >
              A-
            </button>
            <span className="px-2 text-[9px] font-black uppercase font-mono text-[#311B56]/70">
              {textSize}
            </span>
            <button
              onClick={() => {
                if (textSize === 'sm') setTextSize('base');
                else if (textSize === 'base') setTextSize('lg');
                else if (textSize === 'lg') setTextSize('xl');
              }}
              className="w-8 h-full border-l-2 border-[#311B56] flex items-center justify-center font-black text-xs hover:bg-[var(--accent-purple)]/10 brutal-btn-active text-[#311B56]"
              title="Phóng to chữ"
            >
              A+
            </button>
          </div>

          {/* Toggle Bookmark */}
          <button 
            onClick={handleToggleBookmark}
            className={`w-10 h-10 border-2 border-[#311B56] flex items-center justify-center shadow-[2px_2px_0px_#311B56] brutal-btn-active transition-colors ${isBookmarked ? 'bg-[var(--accent-pink)] text-[#311B56]' : 'bg-white text-[#311B56]'}`}
            title={isBookmarked ? "Bỏ lưu tin" : "Lưu tin tức"}
          >
            <Heart size={16} className={isBookmarked ? 'fill-current text-[#8C52FF]' : ''} />
          </button>

          {/* Share link */}
          <button 
            onClick={handleShare}
            className="w-10 h-10 bg-[var(--accent-yellow)] border-2 border-[#311B56] flex items-center justify-center text-[#311B56] shadow-[2px_2px_0px_#311B56] brutal-btn-active relative"
            title="Sao chép link chia sẻ"
          >
            <Share2 size={16} />
            {copied && (
              <span className="absolute -top-8 right-0 bg-[#311B56] text-white text-[9px] font-black px-2 py-1 border border-[#311B56] shadow-md whitespace-nowrap font-mono">
                [ COPIED! ]
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 📖 MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ARTICLE VIEW (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-4 border-[#311B56] bg-white p-6 md:p-8 shadow-[6px_6px_0px_#311B56]">
              
              {/* Category tag */}
              <span className="text-[10px] font-black bg-[var(--accent-yellow)] text-[#311B56] px-3.5 py-1 border-2 border-[#311B56] uppercase tracking-wider inline-block shadow-[2px_2px_0px_#311B56] select-none font-mono mb-4">
                [ {initialArticle.category || 'Anime'} ]
              </span>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-black text-[#311B56] leading-tight uppercase border-b-4 border-[#311B56] pb-5 mb-5 tracking-tight">
                {initialArticle.title}
              </h1>

              {/* Specs */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#311B56]/70 uppercase font-mono mb-6 pb-2">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {initialArticle.date || 'Hôm nay'}</span>
                <span className="flex items-center gap-1.5"><User size={14} /> Trạm Anime</span>
              </div>

              {/* Hero Image */}
              <div className="relative w-full aspect-video border-2 border-[#311B56] shadow-[4px_4px_0px_#311B56] overflow-hidden bg-[#FAF8F5] mb-8">
                <img 
                  src={initialArticle.image} 
                  alt={initialArticle.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/800/450?random=postdetail';
                  }}
                />
              </div>

              {/* Full Article Content */}
              <div className="pt-2 border-t border-[#311B56]/10">
                <div 
                  className={`article-content-prose font-semibold leading-relaxed text-[#311B56]/90 transition-all duration-200 
                    ${getTextSizeClass()}`}
                  dangerouslySetInnerHTML={{ __html: initialArticle.html || '' }}
                />
              </div>

              {/* Source Website Button */}
              <div className="pt-6 border-t-2 border-[#311B56]/10 mt-8">
                <a 
                  href={`https://tramanime.com/post/${initialArticle.slug}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[var(--accent-yellow)] border-2 border-[#311B56] shadow-[4px_4px_0px_#311B56] font-black text-xs uppercase text-center block hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all font-mono"
                >
                  [ XEM BÀI VIẾT NGUỒN TRÊN TRẠM ANIME ] <ExternalLink size={14} className="inline-block ml-1" />
                </a>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: TRENDING SIDEBAR (4/12) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-[100px]">
            <div className="flex items-center gap-2 select-none mb-1">
              <span className="text-[10px] font-black uppercase bg-[var(--accent-pink)] text-[#311B56] px-3.5 py-1.5 border-2 border-[#311B56] shadow-[3px_3px_0px_#311B56] tracking-wider flex items-center gap-1.5 font-mono">
                <TrendingUp size={14} /> [ TIN NÓNG MATRIX 📈 ]
              </span>
            </div>

            <div className="border-4 border-[#311B56] bg-white p-4 shadow-[6px_6px_0px_#311B56] divide-y-2 divide-[#311B56]/10">
              {loadingTrending ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <RefreshCw size={20} className="animate-spin text-[var(--accent-purple)]" />
                  <span className="text-[9px] font-black uppercase font-mono tracking-widest text-[#311B56]/50">
                    [ LOADING MATRIX... ]
                  </span>
                </div>
              ) : trendingNews.length > 0 ? (
                trendingNews.map((item, idx) => (
                  <a
                    key={idx}
                    href={`/news/${item.slug}`}
                    className="flex items-center gap-3.5 py-3.5 group cursor-pointer first:pt-1 last:pb-1 decoration-transparent block"
                  >
                    {/* Rank */}
                    <div className="w-8 h-8 shrink-0 border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] flex items-center justify-center text-xs font-black select-none bg-[var(--accent-yellow)]">
                      {(idx + 1).toString().padStart(2, '0')}
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-[11px] text-[#311B56] leading-snug uppercase tracking-tight group-hover:text-[var(--accent-purple)] group-hover:underline line-clamp-2">
                        {item.title}
                      </h4>
                    </div>

                    {/* Avatar */}
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
                  </a>
                ))
              ) : (
                <div className="p-8 text-center text-xs font-bold opacity-50 select-none">
                  Chưa có dữ liệu xu hướng
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};
