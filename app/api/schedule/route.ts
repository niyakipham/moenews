import { NextResponse } from 'next/server';

export interface AiringEntry {
  airingAt: number;
  episode: number;
  slug: string;
  title: {
    userPreferred: string;
    english?: string;
    romaji?: string;
    native?: string;
  };
  episodes?: number;
  coverImage: {
    extraLarge?: string;
    large?: string;
    color?: string;
  };
}

export interface ScheduleDay {
  key: string;
  labelVi: string;
  dateIso: string;
  entries: AiringEntry[];
}

export interface WeeklyScheduleResponse {
  success: boolean;
  weekStartIso?: string;
  weekEndIso?: string;
  days?: ScheduleDay[];
  fallback: boolean;
}

const FALLBACK_SCHEDULE: ScheduleDay[] = [
  {
    key: "MONDAY",
    labelVi: "Thứ Hai",
    dateIso: new Date().toISOString().split('T')[0],
    entries: [
      {
        airingAt: Math.floor(Date.now() / 1000),
        episode: 141,
        slug: "xian-ni",
        title: { userPreferred: "Xian Ni", english: "Renegade Immortal" },
        episodes: 180,
        coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx137653-1wHbCVvABGOr.png", color: "#f19350" }
      },
      {
        airingAt: Math.floor(Date.now() / 1000) + 3600,
        episode: 7,
        slug: "isekai-nonbiri-nouka-2",
        title: { userPreferred: "Isekai Nonbiri Nouka 2", english: "Farming Life in Another World 2" },
        episodes: 12,
        coverImage: { large: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx197824-k9Uyef8g49hB.png", color: "#ae7835" }
      }
    ]
  },
  {
    key: "TUESDAY",
    labelVi: "Thứ Ba",
    dateIso: new Date().toISOString().split('T')[0],
    entries: [
      {
        airingAt: Math.floor(Date.now() / 1000),
        episode: 7,
        slug: "marriagetoxin",
        title: { userPreferred: "MARRIAGETOXIN", english: "MarriageToxin" },
        episodes: 12,
        coverImage: { large: "https://picsum.photos/300/450?random=marriagetoxin", color: "#e11d48" }
      }
    ]
  },
  {
    key: "WEDNESDAY",
    labelVi: "Thứ Tư",
    dateIso: new Date().toISOString().split('T')[0],
    entries: [
      {
        airingAt: Math.floor(Date.now() / 1000),
        episode: 7,
        slug: "rezero-kara-hajimeru-isekai-seikatsu-4th-season",
        title: { userPreferred: "Re:Zero kara Hajimeru Isekai Seikatsu 4th Season", english: "Re:Zero - Starting Life in Another World Season 4" },
        episodes: 19,
        coverImage: { large: "https://picsum.photos/300/450?random=rezero", color: "#3b82f6" }
      }
    ]
  },
  {
    key: "THURSDAY",
    labelVi: "Thứ Năm",
    dateIso: new Date().toISOString().split('T')[0],
    entries: [
      {
        airingAt: Math.floor(Date.now() / 1000),
        episode: 8,
        slug: "dr-stone-science-future-part-3",
        title: { userPreferred: "Dr. STONE: SCIENCE FUTURE Part 3", english: "Dr. Stone: Science Future" },
        episodes: 13,
        coverImage: { large: "https://picsum.photos/300/450?random=drstone", color: "#10b981" }
      }
    ]
  },
  {
    key: "FRIDAY",
    labelVi: "Thứ Sáu",
    dateIso: new Date().toISOString().split('T')[0],
    entries: [
      {
        airingAt: Math.floor(Date.now() / 1000),
        episode: 7,
        slug: "tensei-shitara-slime-datta-ken-4th-season",
        title: { userPreferred: "Tensei Shitara Slime Datta Ken 4th Season", english: "That Time I Got Reincarnated as a Slime Season 4" },
        episodes: 12,
        coverImage: { large: "https://picsum.photos/300/450?random=slime", color: "#a855f7" }
      }
    ]
  },
  {
    key: "SATURDAY",
    labelVi: "Thứ Bảy",
    dateIso: new Date().toISOString().split('T')[0],
    entries: [
      {
        airingAt: Math.floor(Date.now() / 1000),
        episode: 916,
        slug: "doraemon-2005",
        title: { userPreferred: "Doraemon (2005)", english: "Doraemon" },
        episodes: 2000,
        coverImage: { large: "https://picsum.photos/300/450?random=doraemon", color: "#38bdf8" }
      }
    ]
  },
  {
    key: "SUNDAY",
    labelVi: "Chủ Nhật",
    dateIso: new Date().toISOString().split('T')[0],
    entries: [
      {
        airingAt: Math.floor(Date.now() / 1000),
        episode: 1163,
        slug: "one-piece",
        title: { userPreferred: "ONE PIECE", english: "One Piece" },
        episodes: 1500,
        coverImage: { large: "https://picsum.photos/300/450?random=onepiece", color: "#f59e0b" }
      }
    ]
  }
];

export async function GET() {
  try {
    const res = await fetch('https://tramanime.com/anime/lich-chieu', {
      next: { revalidate: 600 }, // cache for 10 minutes
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error('Fetch failed');

    const html = await res.text();
    const target = "weekStartIso";
    const startIdx = html.indexOf(target);
    
    if (startIdx !== -1) {
      const jsonStart = html.lastIndexOf('{', startIdx);
      let braceCount = 0;
      let jsonEnd = -1;
      
      for (let i = jsonStart; i < html.length; i++) {
        if (html[i] === '{') braceCount++;
        else if (html[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            jsonEnd = i;
            break;
          }
        }
      }

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const rawJson = html.slice(jsonStart, jsonEnd + 1);
        const cleaned = rawJson
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\')
          .replace(/\\n/g, '\n');

        const parsed = JSON.parse(cleaned);
        
        if (parsed && parsed.days) {
          return NextResponse.json({
            success: true,
            weekStartIso: parsed.weekStartIso,
            weekEndIso: parsed.weekEndIso,
            days: parsed.days,
            fallback: false
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      days: FALLBACK_SCHEDULE,
      fallback: true
    });
  } catch (error) {
    console.error('API scraping tramanime.com/anime/lich-chieu failed, utilizing fallbacks:', error);
    return NextResponse.json({
      success: true,
      days: FALLBACK_SCHEDULE,
      fallback: true
    });
  }
}
