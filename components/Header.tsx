'use client';

import React from 'react';
import { Search, Sparkles, RefreshCw, Moon, Sun, Heart, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  fallbackUsed: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  bookmarkCount: number;
  activeTab: 'feed' | 'bookmarks' | 'schedule';
  setActiveTab: (tab: 'feed' | 'bookmarks' | 'schedule') => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  fallbackUsed,
  theme,
  toggleTheme,
  bookmarkCount,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-100px)] max-lg:w-full h-[80px] max-md:h-[70px] flex items-center justify-between px-8 lg:px-10 max-md:px-5 z-[40] bg-[#FAF8F5] border-b-2 border-[#311B56] transition-all duration-300">
      
      {/* Brand logo [ MOENEWS ] - Matching T-ANIME logo format exactly */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTab('feed')}>
          <span className="text-[#311B56] font-mono text-2xl font-bold tracking-tighter">[</span>
          <span className="text-[#311B56] font-black text-lg sm:text-xl tracking-[0.2em] mt-0.5 uppercase">MOENEWS</span>
          <span className="text-[#311B56] font-mono text-2xl font-bold tracking-tighter">]</span>
        </div>
      </div>

      {/* Center Search Input - Match Tani styling (border-2, shadow-4px, Space Mono) */}
      <div className="relative w-full max-w-[400px] mx-4 max-md:mx-2">
        <div className="flex items-center gap-3 bg-[#FAF8F5] border-2 border-[#311B56] shadow-[4px_4px_0px_#311B56] py-2.5 px-5 max-md:py-2 max-md:px-3 transition-all focus-within:translate-y-[2px] focus-within:translate-x-[2px] focus-within:shadow-[2px_2px_0px_#311B56]">
          <button 
            onClick={() => onSearchSubmit(searchQuery)}
            className="focus:outline-none shrink-0"
            title="Tìm kiếm"
          >
            <Search size={18} className="text-[#311B56] hover:scale-110 transition-transform cursor-pointer" />
          </button>
          <input 
            type="text" 
            placeholder="Ấn Enter để tìm kiếm..." 
            className="bg-transparent border-none text-[#311B56] w-full outline-none text-sm font-semibold placeholder:text-[#311B56]/50 font-mono"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearchSubmit(searchQuery);
              }
            }}
          />
        </div>
      </div>

      {/* Actions & Scraper Live Status Badge */}
      <div className="flex items-center gap-4 shrink-0">
        
        {/* Scraper Status Badge */}
        <div className="flex items-center select-none">
          {fallbackUsed ? (
            <span className="text-[10px] font-black bg-[var(--accent-pink)] text-[#311B56] border-2 border-[#311B56] px-2.5 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_0px_#311B56] animate-cute-bounce">
              <RefreshCw size={11} className="animate-spin text-[#311B56]" /> 
              <span className="max-sm:hidden font-mono uppercase">[ Offline ]</span>
              <span className="sm:hidden font-mono">[ OFF ]</span>
            </span>
          ) : (
            <span className="text-[10px] font-black bg-[var(--accent-green)] text-white border-2 border-[#311B56] px-2.5 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_0px_#311B56]">
              <Sparkles size={11} className="animate-pulse" /> 
              <span className="max-sm:hidden font-mono uppercase">[ Live Scraped ]</span>
              <span className="sm:hidden font-mono">[ LIVE ]</span>
            </span>
          )}
        </div>

        {/* Mobile Navigation Toggles */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Schedule button */}
          <button 
            onClick={() => setActiveTab(activeTab === 'schedule' ? 'feed' : 'schedule')}
            className={`w-9 h-9 border-2 border-[#311B56] flex items-center justify-center relative shadow-[2px_2px_0px_#311B56] brutal-btn-active ${activeTab === 'schedule' ? 'bg-[var(--accent-green)] text-white' : 'bg-white text-[#311B56]'}`}
          >
            <Calendar size={16} />
          </button>

          {/* Mobile Bookmark trigger */}
          <button 
            onClick={() => setActiveTab(activeTab === 'bookmarks' ? 'feed' : 'bookmarks')}
            className={`w-9 h-9 border-2 border-[#311B56] flex items-center justify-center relative shadow-[2px_2px_0px_#311B56] brutal-btn-active ${activeTab === 'bookmarks' ? 'bg-[var(--accent-pink)] text-[#311B56]' : 'bg-white text-[#311B56]'}`}
          >
            <Heart size={16} className={activeTab === 'bookmarks' ? 'animate-heart-pulse text-[#8C52FF]' : ''} />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent-yellow)] text-[#311B56] border-2 border-[#311B56] text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-none shadow-[1px_1px_0px_#311B56]">
                {bookmarkCount}
              </span>
            )}
          </button>
        </div>

      </div>

    </header>
  );
};
