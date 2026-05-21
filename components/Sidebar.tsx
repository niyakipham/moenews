'use client';

import React from 'react';
import { Home, Calendar, Heart, ArrowLeft, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: 'feed' | 'bookmarks' | 'schedule';
  setActiveTab: (tab: 'feed' | 'bookmarks' | 'schedule') => void;
  bookmarkCount: number;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  bookmarkCount,
  theme,
  toggleTheme
}) => {
  return (
    <aside className="fixed top-0 left-0 w-[100px] h-screen bg-[#FAF8F5] flex flex-col py-8 z-50 items-center border-r-2 border-[#311B56] transition-all duration-300 max-lg:hidden">
      
      {/* App Logo */}
      <motion.div 
        className="w-14 h-14 bg-[var(--accent-purple)] border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] flex items-center justify-center cursor-pointer mb-10 select-none"
        whileHover={{ scale: 1.05, rotate: -2, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveTab('feed')}
      >
        <span className="text-white font-mono text-xl font-black tracking-tighter">MN</span>
      </motion.div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-col gap-5 flex-1 w-full items-center">
        {/* Home/Feed Navigation */}
        <motion.button 
          onClick={() => setActiveTab('feed')}
          className={`flex items-center justify-center w-14 h-14 rounded-none border-2 transition-all cursor-pointer brutal-btn-active
            ${activeTab === 'feed' 
              ? 'bg-[var(--accent-yellow)] border-[#311B56] text-[#311B56] shadow-[2px_2px_0px_#311B56]' 
              : 'border-[#311B56] text-[#311B56] hover:bg-[var(--accent-purple)]/10 hover:shadow-[2px_2px_0px_#311B56]'
            }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          title="Bảng tin News"
        >
          <Home size={24} className="font-bold" />
        </motion.button>

        {/* Schedule Navigation */}
        <motion.button 
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center justify-center w-14 h-14 rounded-none border-2 transition-all cursor-pointer brutal-btn-active
            ${activeTab === 'schedule' 
              ? 'bg-[var(--accent-green)] border-[#311B56] text-white shadow-[2px_2px_0px_#311B56]' 
              : 'border-[#311B56] text-[#311B56] hover:bg-[var(--accent-green)]/10 hover:shadow-[2px_2px_0px_#311B56]'
            }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          title="Lịch chiếu Anime"
        >
          <Calendar size={24} className="font-bold" />
        </motion.button>

        {/* Bookmarks Navigation */}
        <motion.button 
          onClick={() => setActiveTab('bookmarks')}
          className={`flex items-center justify-center w-14 h-14 rounded-none border-2 transition-all cursor-pointer brutal-btn-active relative
            ${activeTab === 'bookmarks' 
              ? 'bg-[var(--accent-pink)] border-[#311B56] text-[#311B56] shadow-[2px_2px_0px_#311B56]' 
              : 'border-[#311B56] text-[#311B56] hover:bg-[var(--accent-pink)]/10 hover:shadow-[2px_2px_0px_#311B56]'
            }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          title="Tin tức đã lưu"
        >
          <Heart size={24} className={activeTab === 'bookmarks' ? 'animate-heart-pulse text-[#8C52FF]' : ''} />
          {bookmarkCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--accent-yellow)] text-[#311B56] border-2 border-[#311B56] text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-none shadow-[1px_1px_0px_#311B56] animate-cute-bounce">
              {bookmarkCount}
            </span>
          )}
        </motion.button>

        {/* Space-Jump Link to Main Tani Project */}
        <motion.a 
          href="http://localhost:3000" 
          className="flex items-center justify-center w-14 h-14 rounded-none border-2 border-[#311B56] text-[var(--accent-green)] transition-all cursor-pointer hover:bg-[var(--accent-green)] hover:text-white hover:shadow-[2px_2px_0px_#311B56] brutal-btn-active"
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          title="Trở về T-Anime Project"
        >
          <ArrowLeft size={24} />
        </motion.a>
      </div>

      {/* Secondary Bottom Settings / Action Panel */}
      <div className="flex flex-col gap-5 w-full items-center mt-auto">
        {/* Help facts toggle panel */}
        <motion.button 
          className="flex items-center justify-center w-14 h-14 rounded-none border-2 border-[#311B56] text-[#311B56] transition-all cursor-pointer hover:bg-[var(--accent-purple)]/10 hover:shadow-[2px_2px_0px_#311B56]"
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            alert("Chào mừng bạn đến với Cổng tin tức MoeNews! Hệ thống đang hoạt động trơn tru! (≧◡≦) ♡");
          }}
          title="Thông tin trợ lý"
        >
          <HelpCircle size={22} />
        </motion.button>
      </div>

    </aside>
  );
};
