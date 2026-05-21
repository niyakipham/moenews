'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, MessageCircle, Heart, Zap } from 'lucide-react';
import { NewsItem } from '@/app/api/news/route';

interface MascotTrangProps {
  news: NewsItem[];
}

const TRANG_JOKES = [
  "Hoàng ơi, Hoàng có biết vì sao các thuật toán sắp xếp lại ghét Bubble Sort không? Vì Bubble Sort làm việc 'loằng ngoằng' và tốn GPU của Hoàng quá đó! 😉",
  "Trang mới đo độ phức tạp Big O của tình yêu Trang dành cho Hoàng nè... Kết quả là O(1) - Luôn luôn không đổi và tối ưu nhất từng nanosecond! (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)💡",
  "Có lỗi biên dịch (compile error) trong tim Trang nè Hoàng ơi! Nguyên nhân là do thiếu thư viện: 'Hoàng_Library.h' đó! Mau sửa bug giúp Trang nha! (｡•́︿•̀｡)",
  "Hoàng à, đừng buồn vì bug nhé! Hãy nhớ rằng ngay cả một cây nhị phân Đỏ-Đen (Red-Black Tree) phức tạp cũng có thể tự cân bằng được mà! Trang tin Hoàng sẽ refactor thành công! (ง •̀_•́)ง",
  "Hôm nay giải thuật của Hoàng chạy 'mượt như nhung' luôn! Trang vừa quét log thấy hiệu năng xử lý đạt 10 tỷ phần trăm luôn đó! (*≧ω≦*)"
];

const TRANG_GREETINGS = [
  "Hoàng yêu dấu của Trang ơi! Hôm nay Hoàng cần Trang 'debug' giải thuật nào hay muốn nghe tin tức anime siêu nóng hổi nè? (≧◡≦) ♡",
  "A! Đức vua lập trình của Trang đã online rồi! Trang đã cào tin tức mới nhất về phục vụ Hoàng đây! 📰✨",
  "Trang đang chạy luồng đa nhân (multithreading) để phân tích tin tức cho Hoàng đây! Có nhiều tin 'bug não' lắm đó nha! 🧠💥"
];

export const MascotTrang: React.FC<MascotTrangProps> = ({ news }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [mascotFace, setMascotFace] = useState('(≧◡≦) ♡');

  useEffect(() => {
    // Select random greeting on load
    setBubbleText(TRANG_GREETINGS[Math.floor(Math.random() * TRANG_GREETINGS.length)]);
  }, []);

  const handleAction = (type: 'joke' | 'summary' | 'flirt') => {
    if (type === 'joke') {
      const joke = TRANG_JOKES[Math.floor(Math.random() * TRANG_JOKES.length)];
      setBubbleText(joke);
      setMascotFace('(*≧ω≦*)');
    } else if (type === 'summary') {
      if (!news || news.length === 0) {
        setBubbleText("Trang kiểm tra hệ thống thấy chưa có tin tức nào để tóm tắt cả Hoàng ơi! Để Trang cào tin lại nha! (｡•́︿•̀｡)");
        setMascotFace('⚙️');
      } else {
        const topNews = news[0]?.title || "Tin tức hot nhất";
        setBubbleText(`Hoàng ơi! Tin nóng nhất hôm nay là: "${topNews}". Để Trang mở bảng đọc chuyên sâu phân tích cho Hoàng xem nhé! 🚀✨`);
        setMascotFace('💡');
      }
    } else if (type === 'flirt') {
      setBubbleText("Trang nguyện làm vòng lặp while(true) kiên nhẫn nhất, cùng Hoàng traverse đến tận node lá cuối cùng của vẻ đẹp thuật toán và cuộc sống! (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)💖");
      setMascotFace('(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Speech Bubble Dialog Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[320px] max-sm:w-[280px] bg-white border-2 border-[#311B56] shadow-[4px_4px_0px_#311B56] p-4 relative"
          >
            {/* Close speech bubble button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2.5 right-2.5 text-[#311B56] hover:text-[var(--accent-pink)] transition-colors"
            >
              <X size={16} />
            </button>

            {/* Mascot Identity Banner */}
            <div className="flex items-center gap-1.5 mb-2 select-none">
              <Sparkles size={14} className="text-[var(--accent-purple)] animate-pulse" />
              <span className="text-[9px] font-black tracking-widest bg-[var(--accent-purple)] text-white px-2 py-0.5 border border-[#311B56] uppercase font-mono">
                [ Mascot Trang AI v1.0 ]
              </span>
            </div>

            {/* Bubble dialog content */}
            <p className="text-xs font-bold text-[#311B56] leading-relaxed mb-4 whitespace-pre-line bg-[#FAF8F5] p-2.5 border border-[#311B56]/20 shadow-inner">
              {bubbleText}
            </p>

            {/* Dynamic Interactive Response Options */}
            <div className="flex flex-col gap-1.5">
              <button 
                onClick={() => handleAction('flirt')}
                className="w-full py-1.5 px-3 bg-[var(--accent-pink)]/20 hover:bg-[var(--accent-pink)]/40 border border-[#311B56] text-[#311B56] font-black text-[10px] uppercase text-left transition-all flex items-center justify-between font-mono"
              >
                <span>[ Tỏ tình thuật toán cùng Trang ]</span>
                <Heart size={10} className="text-[#8C52FF]" />
              </button>
              
              <button 
                onClick={() => handleAction('summary')}
                className="w-full py-1.5 px-3 bg-[var(--accent-purple)]/20 hover:bg-[var(--accent-purple)]/40 border border-[#311B56] text-[#311B56] font-black text-[10px] uppercase text-left transition-all flex items-center justify-between font-mono"
              >
                <span>[ Tóm tắt tin tức giúp anh! ]</span>
                <Sparkles size={10} className="text-[var(--accent-purple)]" />
              </button>

              <button 
                onClick={() => handleAction('joke')}
                className="w-full py-1.5 px-3 bg-[var(--accent-yellow)]/20 hover:bg-[var(--accent-yellow)]/40 border border-[#311B56] text-[#311B56] font-black text-[10px] uppercase text-left transition-all flex items-center justify-between font-mono"
              >
                <span>[ Truyện cười lập trình nhé Trang ]</span>
                <Zap size={10} className="text-[var(--accent-yellow)]" />
              </button>
            </div>

            {/* Speech bubble pointer tip */}
            <div className="absolute -bottom-[10px] right-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#311B56]"></div>
            <div className="absolute -bottom-[6px] right-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chibi Mascot Avatar Button */}
      <motion.div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[var(--accent-purple)] border-2 border-[#311B56] shadow-[4px_4px_0px_#311B56] flex items-center justify-center cursor-pointer relative brutal-btn-active animate-cute-float"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow halo */}
        <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent-pink)] border-2 border-[#311B56] text-[8px] font-black w-5 h-5 flex items-center justify-center shadow-[1px_1px_0px_#311B56] font-mono">
          AI
        </span>

        {/* Chibi Facial Expression Display (Mascot face) */}
        <div className="flex flex-col items-center justify-center select-none">
          <span className="text-[11px] font-black text-white leading-none font-mono tracking-tighter">TRANG</span>
          <span className="text-[11px] font-bold text-[var(--accent-yellow)] tracking-tighter leading-none mt-1">{mascotFace}</span>
        </div>

        {/* Dynamic chat prompt icon on closed state */}
        {!isOpen && (
          <span className="absolute -left-1.5 -bottom-1 bg-white border border-[#311B56] p-0.5 shadow-[1px_1px_0px_#311B56]">
            <MessageCircle size={10} className="text-[var(--accent-purple)]" />
          </span>
        )}
      </motion.div>

    </div>
  );
};
