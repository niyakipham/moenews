import React, { Suspense } from 'react';
import { GET, NewsItem } from '@/app/api/news/route';
import { MoeNewsClient } from '@/components/MoeNewsClient';

// Disable layout/page cache on requests to ensure real-time news delivery
export const revalidate = 0;

async function getInitialNews(): Promise<{ news: NewsItem[]; fallback: boolean }> {
  try {
    // Call the GET function directly to avoid double HTTP trip at server-side
    const response = await GET();
    const body = await response.json();
    return {
      news: body.news || [],
      fallback: body.fallback || false
    };
  } catch (error) {
    console.error("Direct server fetch of news failed, using fallback:", error);
    // In case of any parsing or structural failure, return safe empty list and fallback triggers
    return {
      news: [],
      fallback: true
    };
  }
}

export default async function Home() {
  const { news, fallback } = await getInitialNews();

  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#311B56] border-t-[#B28DFF] rounded-full animate-spin"></div>
          <span className="text-[#311B56] font-black tracking-widest text-lg animate-pulse uppercase code-font">
            [ TRANG AI IS LOADING DIRECTORY... ]
          </span>
        </div>
      </div>
    }>
      <MoeNewsClient initialNews={news} serverFallback={fallback} />
    </Suspense>
  );
}
