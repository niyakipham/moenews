'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, User, Heart, Share2, ExternalLink, RefreshCw, ArrowLeft, TrendingUp, Clock, Tag, Film, Tv, Award, Play } from 'lucide-react';
import { AnimeDetail } from '@/app/anime/[slug]/page';

interface AnimeItem {
  title: string;
  slug: string;
  image: string;
  format?: string;
  status?: string;
}

interface AnimeDetailClientProps {
  initialAnime: AnimeDetail;
}

export const AnimeDetailClient: React.FC<AnimeDetailClientProps> = ({ initialAnime }) => {
  const [bookmarks, setBookmarks] = useState<AnimeItem[]>([]);
  const [trendingNews, setTrendingNews] = useState<any[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [copied, setCopied] = useState(false);

  // Load bookmarks & trending news on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('moenews_anime_bookmarks');
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

  const isBookmarked = bookmarks.some(b => b.slug === initialAnime.slug);

  const handleToggleBookmark = () => {
    let updated: AnimeItem[] = [];
    const itemToSave: AnimeItem = {
      title: initialAnime.title,
      slug: initialAnime.slug,
      image: initialAnime.coverImage,
      format: initialAnime.format,
      status: initialAnime.status
    };

    if (isBookmarked) {
      updated = bookmarks.filter(b => b.slug !== initialAnime.slug);
    } else {
      updated = [...bookmarks, itemToSave];
    }
    setBookmarks(updated);
    localStorage.setItem('moenews_anime_bookmarks', JSON.stringify(updated));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/anime/${initialAnime.slug}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
            [ ANIME DATABASE 📂 ]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Bookmark */}
          <button 
            onClick={handleToggleBookmark}
            className={`w-10 h-10 border-2 border-[#311B56] flex items-center justify-center shadow-[2px_2px_0px_#311B56] brutal-btn-active transition-colors ${isBookmarked ? 'bg-[var(--accent-pink)] text-[#311B56]' : 'bg-white text-[#311B56]'}`}
            title={isBookmarked ? "Bỏ lưu Anime" : "Lưu vào tủ sách"}
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
          
          {/* LEFT COLUMN: ANIME DETAIL (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-4 border-[#311B56] bg-white p-6 md:p-8 shadow-[6px_6px_0px_#311B56] space-y-6">
              
              {/* Top Meta tag & Format */}
              <div className="flex flex-wrap items-center gap-2 select-none">
                <span className="text-[10px] font-black bg-[var(--accent-purple)] text-white px-3.5 py-1 border-2 border-[#311B56] uppercase tracking-wider inline-block shadow-[2px_2px_0px_#311B56] font-mono">
                  [ {initialAnime.format || 'TV'} ]
                </span>
                <span className="text-[10px] font-black bg-[var(--accent-pink)] text-[#311B56] px-3.5 py-1 border-2 border-[#311B56] uppercase tracking-wider inline-block shadow-[2px_2px_0px_#311B56] font-mono">
                  [ {initialAnime.status || 'Đang phát sóng'} ]
                </span>
                {initialAnime.season && initialAnime.year && (
                  <span className="text-[10px] font-black bg-[var(--accent-yellow)] text-[#311B56] px-3.5 py-1 border-2 border-[#311B56] uppercase tracking-wider inline-block shadow-[2px_2px_0px_#311B56] font-mono">
                    [ {initialAnime.season} {initialAnime.year} ]
                  </span>
                )}
              </div>

              {/* Title & Alternative Titles */}
              <div className="space-y-2 border-b-4 border-[#311B56] pb-5">
                <h1 className="text-2xl md:text-4xl font-black text-[#311B56] leading-tight uppercase tracking-tight">
                  {initialAnime.title}
                </h1>
                {initialAnime.alternativeTitles && (
                  <p className="text-xs md:text-sm font-bold text-[#311B56]/60 leading-relaxed font-mono">
                    {initialAnime.alternativeTitles}
                  </p>
                )}
              </div>

              {/* Poster, Info Block Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Poster Box (5/12) */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  <div className="relative w-full aspect-[3/4] border-4 border-[#311B56] shadow-[4px_4px_0px_#311B56] overflow-hidden bg-[#FAF8F5] shrink-0">
                    <img 
                      src={initialAnime.coverImage} 
                      alt={initialAnime.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/300/400?random=animecover';
                      }}
                    />
                  </div>
                  
                  {/* Actions buttons under poster */}
                  <div className="flex flex-col gap-2">
                    <a 
                      href={`https://tramanime.com/anime/${initialAnime.slug}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[var(--accent-yellow)] border-2 border-[#311B56] shadow-[3px_3px_0px_#311B56] font-black text-[10px] uppercase text-center flex items-center justify-center gap-1 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_#311B56] transition-all font-mono"
                    >
                      <Play size={12} className="fill-current text-[#311B56]" />
                      [ XEM PHIM TRÊN TRẠM ANIME ]
                    </a>
                  </div>
                </div>

                {/* Right Side: Airing info & Quick Stats (7/12) */}
                <div className="md:col-span-7 flex flex-col gap-4 justify-between">
                  
                  {/* AIRING COUNTDOWN BOX */}
                  {initialAnime.nextAiring ? (
                    <div className="border-4 border-[#311B56] bg-[var(--accent-yellow)] p-4 shadow-[4px_4px_0px_#311B56] flex flex-col gap-2">
                      <div className="flex items-center gap-2 border-b-2 border-[#311B56] pb-2">
                        <Clock size={16} className="text-[#311B56] animate-cute-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                          [ LỊCH PHÁT SÓNG TIẾP THEO ⏰ ]
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs font-black text-[#311B56] uppercase">
                          Tập {initialAnime.nextAiring.episode} (theo lịch tập)
                        </p>
                        <p className="text-[10px] font-bold text-[#311B56]/80 font-mono">
                          Khởi chiếu lúc {initialAnime.nextAiring.timeStr}
                        </p>
                        {initialAnime.nextAiring.relativeTime && (
                          <div className="mt-2 inline-block bg-[#311B56] text-[#FAF8F5] text-[9px] font-black uppercase px-2 py-1 font-mono tracking-wider shadow-[1px_1px_0px_#FAF8F5]">
                            [ {initialAnime.nextAiring.relativeTime} ]
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-[#311B56]/30 bg-[#FAF8F5] p-4 text-center text-xs font-bold text-[#311B56]/50 select-none">
                      Chưa cập nhật lịch phát sóng tập kế tiếp
                    </div>
                  )}

                  {/* QUICK STATS CONTAINER */}
                  <div className="border-2 border-[#311B56] bg-[#FAF8F5] p-4 shadow-[2px_2px_0px_#311B56] space-y-3">
                    <div className="flex items-center gap-1.5 border-b border-[#311B56]/10 pb-1.5">
                      <Film size={14} className="text-[var(--accent-purple)]" />
                      <span className="text-[9px] font-black uppercase font-mono text-[#311B56]/70">[ HỒ SƠ DỮ LIỆU ]</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] font-extrabold uppercase font-mono">
                      <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                        <span className="opacity-50">Thể loại:</span>
                        <span className="text-right truncate max-w-[120px]">{initialAnime.genres.slice(0, 2).join(', ') || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                        <span className="opacity-50">Studio:</span>
                        <span className="text-right truncate max-w-[120px]">{initialAnime.studios[0] || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                        <span className="opacity-50">Năm chiếu:</span>
                        <span>{initialAnime.year || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                        <span className="opacity-50">Định dạng:</span>
                        <span>{initialAnime.format || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* DESCRIPTION SECTION */}
              <div className="border-4 border-[#311B56] bg-white p-5 shadow-[4px_4px_0px_#311B56] space-y-2.5">
                <div className="flex items-center gap-2 border-b-2 border-[#311B56]/10 pb-2">
                  <span className="text-[10px] font-black bg-[var(--accent-pink)] text-[#311B56] border border-[#311B56] px-2.5 py-0.5 uppercase tracking-wider font-mono shadow-[1px_1px_0px_#311B56] select-none">
                    [ NỘI DUNG TÓM TẮT 📖 ]
                  </span>
                </div>
                <p className="text-xs font-semibold leading-relaxed text-[#311B56]/90 whitespace-pre-line">
                  {initialAnime.description || 'Chưa cập nhật nội dung chi tiết cho bộ phim này.'}
                </p>
              </div>

              {/* DETAILED STATS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Cột 1: Thông tin phụ */}
                <div className="border-2 border-[#311B56] bg-[#FAF8F5] p-5 shadow-[4px_4px_0px_#311B56] space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-[#311B56]/10 pb-2">
                    <Tag size={14} className="text-[var(--accent-purple)]" />
                    <span className="text-[10px] font-black uppercase font-mono">[ THÔNG TIN CHI TIẾT ]</span>
                  </div>

                  <div className="space-y-2.5 text-xs font-extrabold font-mono">
                    <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                      <span className="opacity-60">THỂ LOẠI:</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                        {initialAnime.genres.map((g, idx) => (
                          <span key={idx} className="bg-white border border-[#311B56]/30 px-1.5 py-0.5 text-[9px] font-black rounded-sm shadow-[1px_1px_0px_#311B56]/10">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                      <span className="opacity-60">STUDIO (HÃNG PHIM):</span>
                      <span className="text-[#311B56]">{initialAnime.studios.join(', ') || 'UNKNOWN'}</span>
                    </div>

                    <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                      <span className="opacity-60">ĐỊNH DẠNG:</span>
                      <span className="text-[#311B56]">{initialAnime.format || 'TV'}</span>
                    </div>

                    <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                      <span className="opacity-60">TRẠNG THÁI:</span>
                      <span className="text-[#311B56]">{initialAnime.status || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Cột 2: MAL stats */}
                <div className="border-2 border-[#311B56] bg-[#FAF8F5] p-5 shadow-[4px_4px_0px_#311B56] space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-[#311B56]/10 pb-2">
                    <Award size={14} className="text-[var(--accent-purple)]" />
                    <span className="text-[10px] font-black uppercase font-mono">[ CHỈ SỐ MYANIMELIST (MAL) ]</span>
                  </div>

                  <div className="space-y-2.5 text-xs font-extrabold font-mono">
                    <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                      <span className="opacity-60">ĐIỂM SỐ MAL:</span>
                      <span className="text-[var(--accent-purple)] font-black">{initialAnime.malScore || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                      <span className="opacity-60">THỨ HẠNG MAL:</span>
                      <span className="text-[#311B56]">{initialAnime.malRank || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                      <span className="opacity-60">ĐỘ PHỔ BIẾN:</span>
                      <span className="text-[#311B56]">{initialAnime.malPopularity || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between border-b border-[#311B56]/5 pb-1">
                      <span className="opacity-60">THÀNH VIÊN THEO DÕI:</span>
                      <span className="text-[#311B56]">{initialAnime.malMembers || 'N/A'}</span>
                    </div>
                  </div>
                </div>

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
