'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, RefreshCw, AlertCircle, Play } from 'lucide-react';
import { ScheduleDay, AiringEntry } from '@/app/api/schedule/route';

export const ScheduleTab: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<{ days?: ScheduleDay[]; weekStartIso?: string; weekEndIso?: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDayKey, setActiveDayKey] = useState<string>('ALL');

  useEffect(() => {
    async function fetchSchedule() {
      try {
        setLoading(true);
        const res = await fetch('/api/schedule');
        if (!res.ok) throw new Error('Không thể tải lịch chiếu');
        const data = await res.json();
        if (data.success) {
          setScheduleData({
            days: data.days,
            weekStartIso: data.weekStartIso,
            weekEndIso: data.weekEndIso
          });
          
          // Set active day to today's day of week by default
          const today = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
          const dayKeys = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
          const todayKey = dayKeys[today];
          
          // Verify today has entries, otherwise default to MONDAY
          if (data.days?.some((d: any) => d.key === todayKey && d.entries?.length > 0)) {
            setActiveDayKey(todayKey);
          } else {
            setActiveDayKey('ALL');
          }
        } else {
          throw new Error(data.message || 'Lỗi không xác định');
        }
      } catch (err: any) {
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu lịch chiếu');
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, []);

  // Helper to format Unix timestamp to HH:MM
  const formatAiringTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '00:00';
    }
  };

  const getDayColor = (key: string) => {
    switch (key) {
      case 'MONDAY': return 'var(--accent-purple)';
      case 'TUESDAY': return 'var(--accent-pink)';
      case 'WEDNESDAY': return 'var(--accent-yellow)';
      case 'THURSDAY': return 'var(--accent-green)';
      case 'FRIDAY': return 'var(--accent-purple)';
      case 'SATURDAY': return 'var(--accent-pink)';
      case 'SUNDAY': return '#F43F5E';
      default: return 'var(--accent-purple)';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-2 border-[#311B56] bg-white shadow-[4px_4px_0px_#311B56] max-w-xl mx-auto w-full text-center">
        <RefreshCw size={48} className="text-[var(--accent-purple)] mb-4 animate-spin" />
        <h3 className="text-xl font-black uppercase text-[#311B56]">Đang tải lịch chiếu...</h3>
        <p className="text-xs font-bold text-[#311B56]/60 mt-2 font-mono">[ CONNECTING TO SOURCES... ]</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-[#311B56] bg-white shadow-[4px_4px_0px_#311B56] max-w-xl mx-auto w-full text-center border-red-500">
        <AlertCircle size={48} className="text-red-500 mb-4 animate-bounce" />
        <h3 className="text-xl font-black uppercase text-red-500">Có lỗi xảy ra!</h3>
        <p className="text-xs font-bold text-[#311B56]/70 mt-2 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-[var(--accent-purple)] border-2 border-[#311B56] shadow-[2px_2px_0px_#311B56] font-black text-xs text-white uppercase brutal-btn-active font-mono"
        >
          [ THỬ TẢI LẠI LỊCH ]
        </button>
      </div>
    );
  }

  const { days, weekStartIso, weekEndIso } = scheduleData;
  const filteredDays = days?.filter(day => activeDayKey === 'ALL' || day.key === activeDayKey) || [];

  return (
    <div className="space-y-6">
      
      {/* 📅 Date Frame Neo-Brutalist Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-2 border-[#311B56] bg-white p-5 shadow-[4px_4px_0px_#311B56]">
        <div>
          <h2 className="text-2xl font-black uppercase text-[#311B56] flex items-center gap-2 select-none">
            <Calendar className="text-[var(--accent-purple)]" /> Lịch Chiếu Anime Tuần Này
          </h2>
          {weekStartIso && weekEndIso && (
            <p className="text-xs font-black text-[#311B56]/60 mt-1 uppercase select-none font-mono">
              Khung thời gian: <span className="text-[var(--accent-purple)]">{weekStartIso}</span> đến <span className="text-[var(--accent-purple)]">{weekEndIso}</span>
            </p>
          )}
        </div>
        
        {/* Dynamic Day Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
          <button
            onClick={() => setActiveDayKey('ALL')}
            className={`px-3 py-1.5 border-2 text-xs font-black uppercase transition-all select-none whitespace-nowrap brutal-btn-active
              ${activeDayKey === 'ALL'
                ? 'bg-[#311B56] text-[#FAF8F5] border-[#311B56] shadow-[2px_2px_0px_#311B56]'
                : 'bg-white border-[#311B56]/30 text-[#311B56] hover:bg-[var(--accent-purple)]/5'
              }`}
          >
            Tất cả 📅
          </button>
          
          {days?.map(day => (
            <button
              key={day.key}
              onClick={() => setActiveDayKey(day.key)}
              className={`px-3 py-1.5 border-2 text-xs font-black uppercase transition-all select-none whitespace-nowrap brutal-btn-active
                ${activeDayKey === day.key
                  ? 'text-white border-[#311B56] shadow-[2px_2px_0px_#311B56]'
                  : 'bg-white border-[#311B56]/30 text-[#311B56] hover:bg-[var(--accent-purple)]/5'
                }`}
              style={{
                backgroundColor: activeDayKey === day.key ? getDayColor(day.key) : undefined
              }}
            >
              {day.labelVi}
            </button>
          ))}
        </div>
      </div>

      {/* 📅 Days Schedule Layout Router */}
      {activeDayKey === 'ALL' ? (
        
        /* MULTI-COLUMN WEEKLY LIST (Show All) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredDays.map(day => (
            <motion.div
              key={day.key}
              className="border-2 border-[#311B56] bg-white shadow-[4px_4px_0px_#311B56] overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Day Header Badge */}
              <div 
                className="p-4 border-b-2 border-[#311B56] flex items-center justify-between text-white select-none font-mono"
                style={{ backgroundColor: getDayColor(day.key) }}
              >
                <span className="font-black uppercase text-sm tracking-wider">[ {day.labelVi} ]</span>
                <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 border border-white/30 uppercase">
                  {day.entries?.length || 0} Anime
                </span>
              </div>

              {/* Airing Entries List */}
              <div className="divide-y-2 divide-[#311B56]/10 max-h-[500px] overflow-y-auto scrollbar-hide">
                {day.entries && day.entries.length > 0 ? (
                  day.entries.map((entry, idx) => (
                    <motion.a
                      key={idx}
                      href={`/anime/${entry.slug}`}
                      className="flex items-center gap-3.5 p-3.5 hover:bg-[var(--accent-purple)]/[0.03] transition-colors group relative block decoration-transparent"
                      whileHover={{ x: 3 }}
                    >
                      {/* Time slot */}
                      <div className="flex flex-col items-center justify-center shrink-0 border-2 border-[#311B56] bg-[#FAF8F5] px-2 py-1 shadow-[2px_2px_0px_#311B56] text-[10px] font-black select-none font-mono">
                        <Clock size={10} className="mb-0.5 text-[var(--accent-purple)]" />
                        {formatAiringTime(entry.airingAt)}
                      </div>

                      {/* Thumbnail cover */}
                      <div className="relative w-11 h-14 shrink-0 border-2 border-[#311B56] overflow-hidden bg-zinc-100 shadow-[1px_1px_0px_#311B56]">
                        <img
                          src={entry.coverImage?.large || entry.coverImage?.extraLarge || 'https://picsum.photos/100/140?random=schedule'}
                          alt={entry.title.userPreferred}
                          className="w-full h-full object-cover grayscale-[10%] contrast-[1.1]"
                        />
                      </div>

                      {/* Anime metadata */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-xs text-[#311B56] uppercase leading-tight tracking-tight line-clamp-2 group-hover:text-[var(--accent-purple)] transition-colors">
                          {entry.title.userPreferred}
                        </h4>
                        
                        <div className="flex items-center gap-2 mt-1 select-none font-mono">
                          <span className="text-[8px] font-black bg-[var(--accent-yellow)] text-[#311B56] border border-[#311B56]/30 px-1.5 uppercase shadow-[1px_1px_0px_#311B56]">
                            Tập {entry.episode}
                          </span>
                          
                          {entry.episodes && (
                            <span className="text-[8px] font-bold opacity-50 uppercase">
                              Full: {entry.episodes} tập
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick play hover button */}
                      <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--accent-yellow)] border-2 border-[#311B56] w-7 h-7 flex items-center justify-center shadow-[1px_1px_0px_#311B56]">
                        <Play size={10} className="fill-current text-[#311B56] ml-0.5" />
                      </div>

                    </motion.a>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs font-bold opacity-50 select-none">
                    Không có lịch chiếu cho ngày này
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      ) : (

        /* DYNAMIC ADAPTIVE FULL-SIZE GRID (Show Single Selected Day) */
        filteredDays.map(day => (
          <div key={day.key} className="space-y-6">
            
            {/* Day Header Wide Banner */}
            <div 
              className="p-5 border-2 border-[#311B56] flex items-center justify-between text-white select-none shadow-[4px_4px_0px_#311B56]"
              style={{ backgroundColor: getDayColor(day.key) }}
            >
              <div>
                <span className="text-[9px] font-black bg-white/20 px-2 py-0.5 border border-white/30 uppercase tracking-widest block w-fit mb-1 font-mono">
                  [ AIRING TIME SLOTS 🎬 ]
                </span>
                <h3 className="font-black uppercase text-2xl md:text-3xl tracking-wider select-text">{day.labelVi}</h3>
              </div>
              <span className="text-xs md:text-sm font-black bg-white text-[#311B56] px-4 py-2 border-2 border-[#311B56] uppercase shadow-[2px_2px_0px_#311B56] font-mono">
                [ {day.entries?.length || 0} ANIME AIRING ]
              </span>
            </div>

            {/* Airing Anime Dynamic Matrix */}
            {day.entries && day.entries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {day.entries.map((entry, idx) => (
                  <motion.a
                    key={idx}
                    href={`/anime/${entry.slug}`}
                    className="flex flex-col border-2 border-[#311B56] bg-white p-4 shadow-[4px_4px_0px_#311B56] hover:-translate-y-1.5 hover:-translate-x-1.5 hover:shadow-[8px_8px_0px_#311B56] transition-all group relative overflow-hidden block decoration-transparent"
                    whileHover={{ scale: 1.015 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                  >
                    {/* Big Thumbnail Cover Frame */}
                    <div className="relative w-full aspect-[3/4] border-2 border-[#311B56] overflow-hidden bg-zinc-100 mb-3 shrink-0">
                      <img
                        src={entry.coverImage?.extraLarge || entry.coverImage?.large || 'https://picsum.photos/300/400?random=schedule'}
                        alt={entry.title.userPreferred}
                        className="w-full h-full object-cover grayscale-[3%] contrast-[1.05] transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Airing Time Float Badge */}
                      <div className="absolute top-2.5 left-2.5 bg-[var(--accent-purple)] text-white border-2 border-[#311B56] text-[10px] font-black px-2.5 py-1 uppercase shadow-[2px_2px_0px_#311B56] flex items-center gap-1 select-none font-mono">
                        <Clock size={11} /> {formatAiringTime(entry.airingAt)}
                      </div>
                    </div>

                    {/* Meta specs */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-xs md:text-sm text-[#311B56] uppercase leading-snug tracking-tight group-hover:text-[var(--accent-purple)] group-hover:underline transition-colors line-clamp-2">
                          {entry.title.userPreferred}
                        </h4>
                      </div>
                      
                      {/* Bottom state strip */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#311B56]/10 select-none">
                        <span className="text-[9px] font-black bg-[var(--accent-yellow)] text-[#311B56] border-2 border-[#311B56] px-2 py-0.5 uppercase shadow-[1px_1px_0px_#311B56] font-mono">
                          [ TẬP {entry.episode} ]
                        </span>
                        
                        {entry.episodes && (
                          <span className="text-[8px] font-black opacity-60 uppercase font-mono">
                            FULL: {entry.episodes} TẬP
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Float watch hover button */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 bg-[var(--accent-pink)] border-2 border-[#311B56] w-9 h-9 flex items-center justify-center shadow-[2px_2px_0px_#311B56]">
                      <Play size={12} className="fill-current text-[#311B56] ml-0.5 animate-pulse" />
                    </div>

                  </motion.a>
                ))}
              </div>
            ) : (
              <div className="p-16 border-2 border-[#311B56] bg-white shadow-[4px_4px_0px_#311B56] max-w-xl mx-auto w-full text-center">
                <Calendar size={48} className="text-[var(--accent-purple)] mb-4 animate-cute-bounce" />
                <h3 className="text-xl font-black uppercase text-[#311B56]">Trống lịch phát sóng</h3>
                <p className="text-xs font-bold text-[#311B56]/60 mt-2">Hôm nay không có bất kỳ bộ phim anime nào có lịch phát hành mới.</p>
              </div>
            )}

          </div>
        ))
      )}

    </div>
  );
};
