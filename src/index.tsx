import React from 'react';
import { createRoot } from 'react-dom/client';
import '@/app/globals.css';

const App = () => {
  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-black text-[#311B56] mb-4">MoeNews</h1>
        <p className="text-lg text-[#311B56] mb-6">Cổng Tin Tức & Lịch Chiếu Anime</p>
        <div className="w-16 h-16 border-4 border-[#311B56] border-t-[#B28DFF] rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-[#311B56] font-mono text-sm opacity-70">Loading...</p>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
