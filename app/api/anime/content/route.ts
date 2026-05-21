import { NextRequest, NextResponse } from 'next/server';

export interface AnimeDetail {
  title: string;
  alternativeTitles: string;
  coverImage: string;
  description: string;
  format: string;
  status: string;
  season: string;
  year: string;
  genres: string[];
  studios: string[];
  nextAiring: {
    episode: number;
    timeStr: string;
    relativeTime: string;
  } | null;
  malScore: string;
  malRank: string;
  malPopularity: string;
  malMembers: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug parameter is required' }, { status: 400 });
    }
    
    const targetUrl = `https://tramanime.com/anime/${slug}`;
    
    const res = await fetch(targetUrl, {
      next: { revalidate: 3600 }, // cache for 1 hour
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error('Không thể kết nối đến Trạm Anime');
    
    const html = await res.text();
    
    // 1. Title chính
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].trim() : "Unknown Title";

    // 2. Alternative Titles (Tên phụ)
    let alternativeTitles = "";
    const altRegex = new RegExp(title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\s*•\\s*([^<]+)', 'i');
    const altMatch = html.match(altRegex);
    if (altMatch) {
      alternativeTitles = altMatch[1].trim();
    } else {
      const textMatch = html.match(/>([^<]+•[^<]+)</);
      if (textMatch) alternativeTitles = textMatch[1].trim();
    }

    // 3. Cover Image
    const ogImage = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
    const coverImage = ogImage ? ogImage[1] : "";

    // 4. Description
    const ogDesc = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i) ||
                   html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
    const description = ogDesc ? ogDesc[1] : "";

    // 5. Format & Status
    const formatMatch = html.match(/>(TV|Movie|OVA|ONA|Special)<\/span>/i);
    const format = formatMatch ? formatMatch[1] : "TV";
    
    const statusMatch = html.match(/>(Đang phát sóng|Đã hoàn thành|Chưa phát sóng|Đã kết thúc)<\/span>/i);
    const status = statusMatch ? statusMatch[1] : "Đang phát sóng";

    // 6. Season & Year
    const seasonMatch = html.match(/season=([A-Z]+)/i);
    const season = seasonMatch ? seasonMatch[1] : "";
    const yearMatch = html.match(/year=(\d{4})/i);
    const year = yearMatch ? yearMatch[1] : "";

    // 7. Genres
    const genres: string[] = [];
    const genreRegex = /href="\/anime\?genre=([^"]+)"[^>]*>([^<]+)/gi;
    let genreMatch;
    while ((genreMatch = genreRegex.exec(html)) !== null) {
      if (!genres.includes(genreMatch[2].trim())) {
        genres.push(genreMatch[2].trim());
      }
    }

    // 8. Studios
    const studios: string[] = [];
    const studioIdx = html.indexOf("Hãng phim (Studio)");
    if (studioIdx !== -1) {
      const studioSection = html.slice(studioIdx, studioIdx + 1000);
      const studioRegex = /text-zinc-700[^>]*>([^<]+)/gi;
      let sMatch;
      while ((sMatch = studioRegex.exec(studioSection)) !== null) {
        studios.push(sMatch[1].trim());
      }
    }

    // 9. Next Airing Schedule
    let nextAiring = null;
    const nextEpMatch = html.match(/Tập\s+(\d+)\s+\(theo lịch tập\)/i);
    if (nextEpMatch) {
      const episode = parseInt(nextEpMatch[1]);
      const timeIdx = html.indexOf("Tập " + episode + " (theo lịch tập)");
      let timeStr = "";
      let relativeTime = "";
      if (timeIdx !== -1) {
        const timeSection = html.slice(timeIdx, timeIdx + 500);
        const cleanTimeSection = timeSection.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
        const matchDetails = cleanTimeSection.match(/lúc\s+(\d{2}:\d{2}\s+[^(\n]+)/i);
        if (matchDetails) {
          timeStr = matchDetails[1].trim();
        }
        const relMatch = cleanTimeSection.match(/\(GMT\+7\)\s*([\d\s\w\p{L}]+)/iu);
        if (relMatch) {
          relativeTime = relMatch[1].trim();
        }
      }
      nextAiring = { episode, timeStr, relativeTime };
    }

    // 10. MAL Stats
    const scoreMatch = html.match(/Điểm số MAL<\/span>\s*<span[^>]*>([^<]+)<\/span>/i);
    const rankMatch = html.match(/Thứ hạng MAL<\/span>\s*<span[^>]*>([^<]+)<\/span>/i);
    const popularityMatch = html.match(/Độ phổ biến MAL<\/span>\s*<span[^>]*>([^<]+)<\/span>/i);
    const membersMatch = html.match(/Thành viên MAL<\/span>\s*<span[^>]*>([^<]+)<\/span>/i);

    const data: AnimeDetail = {
      title,
      alternativeTitles,
      coverImage,
      description,
      format,
      status,
      season,
      year,
      genres,
      studios,
      nextAiring,
      malScore: scoreMatch ? scoreMatch[1].trim() : "N/A",
      malRank: rankMatch ? rankMatch[1].trim() : "N/A",
      malPopularity: popularityMatch ? popularityMatch[1].trim() : "N/A",
      malMembers: membersMatch ? membersMatch[1].trim() : "N/A"
    };

    return NextResponse.json({
      success: true,
      data,
      fallback: false
    });
  } catch (error: any) {
    console.error('API scraping anime content failed, utilizing fallback detailed info:', error);
    
    // Fallback data
    const fallbackData: AnimeDetail = {
      title: "Chibi Godzilla Raids Again Season 3",
      alternativeTitles: "Chibi Godzilla no Gyakushuu 3 • ちびゴジラの逆襲(第3期)",
      coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx193883-Im5tNHwtfAmz.jpg",
      description: "Phần thứ 3 của loạt phim hoạt hình ngắn hài hước Chibi Godzilla no Gyakushuu. Lần này, chú khủng long nhí Chibi Godzilla cùng những quái vật tí hon khác trên Đảo Quái Vật tiếp tục mang đến những câu chuyện cực kỳ dí dỏm, đầy tiếng cười châm biếm sâu cay và những màn cự cãi dở khóc dở cười nhưng vô cùng đáng yêu.",
      format: "TV",
      status: "Đang phát sóng",
      season: "SPRING",
      year: "2026",
      genres: ["Hài hước", "Giả tưởng"],
      studios: ["Pie in the sky", "Toho"],
      nextAiring: {
        episode: 48,
        timeStr: "05:06 Thứ Tư, 27 tháng 5, 2026",
        relativeTime: "Còn khoảng 5 ngày phát sóng"
      },
      malScore: "N/A",
      malRank: "#15843",
      malPopularity: "#18569",
      malMembers: "500"
    };
    
    return NextResponse.json({
      success: true,
      data: fallbackData,
      fallback: true
    });
  }
}
