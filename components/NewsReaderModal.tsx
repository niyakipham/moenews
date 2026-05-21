'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, User, Heart, Share2, ExternalLink, RefreshCw } from 'lucide-react';
import { NewsItem } from '@/app/api/news/route';

interface NewsReaderModalProps {
  item: NewsItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const NewsReaderModal: React.FC<NewsReaderModalProps> = ({
  item,
  onClose,
  isBookmarked,
  onToggleBookmark
}) => {
  const [copied, setCopied] = useState(false);
  const [fullContentHtml, setFullContentHtml] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [contentError, setContentError] = useState<string | null>(null);
  const [textSize, setTextSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  useEffect(() => {
    if (!item) return;
    const slug = item.slug;

    async function fetchFullContent() {
      try {
        setLoadingContent(true);
        setContentError(null);
        setFullContentHtml(null);
        
        const res = await fetch(`/api/news/content?slug=${slug}`);
        if (!res.ok) throw new Error('Không thể tải toàn bộ nội dung');
        
        const data = await res.json();
        if (data.success && data.html) {
          setFullContentHtml(data.html);
        } else {
          throw new Error(data.error || 'Lỗi bóc tách nội dung');
        }
      } catch (err: any) {
        setContentError(err.message || 'Lỗi kết nối');
      } finally {
        setLoadingContent(false);
      }
    }

    fetchFullContent();
    setCopied(false);
  }, [item?.slug]);

  if (!item) return null;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}?post=${item.slug}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#311B56]/40 backdrop-blur-sm">
      
      {/* Semi-transparent overlay to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Main Drawer Slide-Over Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-[650px] h-full bg-[#FAF8F5] border-l-2 border-[#311B56] shadow-2xl flex flex-col z-10"
      >
        
        {/* Header Action bar */}
        <div className="h-[75px] border-b-2 border-[#311B56] px-6 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-widest bg-[var(--accent-purple)] text-white px-2 py-0.5 border border-[#311B56] uppercase font-mono">
              [ ARTICLE VIEW 📖 ]
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Bookmark */}
            <button 
              onClick={onToggleBookmark}
              className={`w-10 h-10 border-2 border-[#311B56] flex items-center justify-center shadow-[2px_2px_0px_#311B56] brutal-btn-active transition-colors ${isBookmarked ? 'bg-[var(--accent-pink)] text-[#311B56]' : 'bg-white text-[#311B56]'}`}
              title={isBookmarked ? "Bỏ lưu tin" : "Lưu tin tức"}
            >
              <Heart size={16} className={isBookmarked ? 'fill-current text-[#8C52FF]' : ''} />
            </button>

            {/* Zoom Text Size buttons */}
            <div className="flex items-center border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] bg-white h-10 select-none">
              <button
                onClick={() => {
                  if (textSize === 'xl') setTextSize('lg');
                  else if (textSize === 'lg') setTextSize('base');
                  else if (textSize === 'base') setTextSize('sm');
                }}
                className="w-7 h-full border-r-2 border-[#311B56] flex items-center justify-center font-black text-[10px] hover:bg-[var(--accent-purple)]/10 brutal-btn-active text-[#311B56]"
                title="Thu nhỏ chữ"
              >
                A-
              </button>
              <span className="px-1.5 text-[9px] font-black uppercase font-mono text-[#311B56]/70">
                {textSize}
              </span>
              <button
                onClick={() => {
                  if (textSize === 'sm') setTextSize('base');
                  else if (textSize === 'base') setTextSize('lg');
                  else if (textSize === 'lg') setTextSize('xl');
                }}
                className="w-7 h-full border-l-2 border-[#311B56] flex items-center justify-center font-black text-[10px] hover:bg-[var(--accent-purple)]/10 brutal-btn-active text-[#311B56]"
                title="Phóng to chữ"
              >
                A+
              </button>
            </div>

            {/* Share link */}
            <button 
              onClick={handleShare}
              className="w-10 h-10 bg-[var(--accent-yellow)] border-2 border-[#311B56] flex items-center justify-center text-[#311B56] shadow-[2px_2px_0px_#311B56] brutal-btn-active relative shrink-0"
              title="Sao chép link chia sẻ"
            >
              <Share2 size={16} />
              {copied && (
                <span className="absolute -top-8 bg-[#311B56] text-white text-[9px] font-black px-2 py-1 border border-[#311B56] shadow-md whitespace-nowrap font-mono">
                  [ COPIED! ]
                </span>
              )}
            </button>

            {/* Close drawer */}
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white border-2 border-[#311B56] flex items-center justify-center text-[#311B56] shadow-[2px_2px_0px_#311B56] brutal-btn-active hover:bg-[var(--accent-pink)]/20"
              title="Đóng bảng tin"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide">
          
          {/* Main Category Badge */}
          <span className="text-[9px] font-black bg-[var(--accent-yellow)] text-[#311B56] px-3 py-1 border-2 border-[#311B56] uppercase tracking-wider inline-block shadow-[2px_2px_0px_#311B56] select-none font-mono">
            [ {item.category || 'Anime'} ]
          </span>

          {/* Headline */}
          <h1 className="text-2xl md:text-3xl font-black text-[#311B56] leading-tight uppercase border-b-2 border-[#311B56] pb-4 tracking-tight">
            {item.title}
          </h1>

          {/* Meta specs */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#311B56]/70 uppercase font-mono">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {item.date || 'Hôm nay'}</span>
            <span className="flex items-center gap-1.5"><User size={14} /> Trạm Anime</span>
          </div>

          {/* Main Hero Image */}
          <div className="relative w-full aspect-video border-2 border-[#311B56] shadow-[4px_4px_0px_#311B56] overflow-hidden bg-[#FAF8F5]">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://picsum.photos/600/350?random=modal';
              }}
            />
          </div>

          {/* Excerpt Summary */}
          {item.excerpt && (
            <p className="text-sm font-bold text-[#311B56] leading-relaxed border-l-4 border-[var(--accent-purple)] pl-4 py-1 italic">
              "{item.excerpt}"
            </p>
          )}

          {/* Full Article Content dynamic viewport */}
          <div className="pt-2 border-t border-[#311B56]/10">
            {loadingContent ? (
              <div className="flex flex-col items-center justify-center py-16 border-2 border-[#311B56] bg-white p-6 shadow-[2px_2px_0px_#311B56] mt-2">
                <RefreshCw size={24} className="text-[var(--accent-purple)] mb-3 animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#311B56]/60 font-mono">
                  [ Loading Full Content... ]
                </span>
              </div>
            ) : contentError ? (
              <div className="p-4 border-2 border-red-500 bg-red-50 text-xs font-bold text-[#311B56] mt-2">
                Không thể tải nội dung đầy đủ. Bạn vẫn có thể xem nguồn gốc bài viết ở bên dưới.
              </div>
            ) : (
              <div 
                className={`article-content-prose font-semibold leading-relaxed text-[#311B56]/90 transition-all duration-200 
                  ${textSize === 'sm' ? 'text-xs' : textSize === 'base' ? 'text-sm' : textSize === 'lg' ? 'text-base' : 'text-lg'}`}
                dangerouslySetInnerHTML={{ __html: fullContentHtml || '' }}
              />
            )}
          </div>

          {/* External Source Link */}
          <div className="pt-2">
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[var(--accent-yellow)] border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] font-black text-xs uppercase text-center block hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all font-mono"
            >
              [ VISIT SOURCE WEBSITE ] <ExternalLink size={14} className="inline-block ml-1" />
            </a>
          </div>

        </div>

      </motion.div>

    </div>
  );
};
