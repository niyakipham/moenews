import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoeNews 📰 | Cổng Tin Tức & Lịch Chiếu Anime",
  description: "Trực quan hóa tin tức và lịch chiếu Anime thời gian thực từ Trạm Anime.",
  keywords: ["anime", "manga", "light novel", "game", "tani", "moenews", "tin tuc anime", "lich chieu anime"],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="vi" 
      style={{ '--font-sans': '"Inter", sans-serif', '--font-mono': '"Space Mono", monospace' } as React.CSSProperties}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning className="font-sans bg-[#FAF8F5] text-[#311B56] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
