import { NextResponse, NextRequest } from 'next/server';

export interface NewsItem {
  title: string;
  url: string;
  slug: string;
  image: string;
  date?: string;
  excerpt?: string;
  category?: 'anime' | 'manga' | 'novel' | 'game' | 'community';
}

const FALLBACK_SPOTLIGHT: NewsItem[] = [
  {
    title: "Anime ''Mushoku Tensei'' mùa 3 chính thức công bố hình ảnh chủ đạo mới và ấn định lịch phát hành vào đầu tháng 7",
    url: "https://tramanime.com/post/anime-mushoku-tensei-mua-3-chinh-thuc-cong-bo-hinh-anh-chu-dao-moi-va-an-dinh-lich-phat-hanh-vao-dau-thang-7",
    slug: "anime-mushoku-tensei-mua-3-chinh-thuc-cong-bo-hinh-anh-chu-dao-moi-va-an-dinh-lich-phat-hanh-vao-dau-thang-7",
    image: "https://cdn-1.tramanime.com/images/2026/05/1779200423083-gplgGe05uKJ64qB.png",
    date: "19 THG 5, 2026",
    excerpt: "Anime Mushoku Tensei mùa 3 chính thức công bố hình ảnh chủ đạo mới và ấn định lịch phát hành vào đầu tháng 7, hứa hẹn mở đầu cho một mùa phim anime vô cùng sôi động.",
    category: "anime"
  },
  {
    title: "''Chainsaw Man'' chính là sự đồng điệu giữa anime và hãng, Chủ tịch MAPPA cho biết",
    url: "https://tramanime.com/post/chainsaw-man-chinh-la-su-dong-dieu-giua-anime-va-hang-chu-tich-mappa-cho-biet",
    slug: "chainsaw-man-chinh-la-su-dong-dieu-giua-anime-va-hang-chu-tich-mappa-cho-biet",
    image: "https://cdn-1.tramanime.com/images/2026/03/1774961868257-Chainsaw-Man-Assassins-Arc-poster-16x9.webp",
    date: "19 THG 5, 2026",
    excerpt: "Nối tiếp thành công vang dội của phim chiếu rạp \"Chainsaw Man – The Movie: Chương Reze\" tại phòng vé Nhật Bản và Mỹ, studio MAPPA hiện đang tất bật chuẩn bị cho bản chuyển thể anime tiếp theo.",
    category: "anime"
  }
];

const FALLBACK_LATEST: NewsItem[] = [
  {
    title: "Căng thẳng: Cuộc khẩu chiến nảy lửa giữa ban quản trị mới của AnimeVsub và các nhóm dịch thuật bản quyền",
    url: "https://tramanime.com/post/cang-thang-cuoc-khau-chien-nay-lua-giua-ban-quan-tri-moi-cua-animevsub-va-cac-nhom-dich-thuat-ban-quyen",
    slug: "cang-thang-cuoc-khau-chien-nay-lua-giua-ban-quan-tri-moi-cua-animevsub-va-cac-nhom-dich-thuat-ban-quyen",
    image: "https://cdn-1.tramanime.com/images/2026/05/1779169183810-3f6zysp5eQW0MCY.png",
    date: "19 THG 5, 2026",
    excerpt: "Mới đây, cộng đồng người hâm mộ anime tại Việt Nam đang chứng kiến một cuộc tranh cãi gay gắt trên mạng xã hội giữa ban quản trị mới của nền tảng xem phim AnimeVsub và các nhóm dịch thuật.",
    category: "community"
  },
  {
    title: "Nền tảng lậu hàng đầu Việt Nam, AnimeV*** thông báo chuyển giao quyền vận hành cho đối tác mới trước làn sóng siết chặt bản quyền số",
    url: "https://tramanime.com/post/nen-tang-lau-hang-dau-viet-nam-animev-thong-bao-chuyen-giao-quyen-van-hanh-cho-doi-tac-moi-truoc-lan-song-siet-chat-ban-quyen-so",
    slug: "nen-tang-lau-hang-dau-viet-nam-animev-thong-bao-chuyen-giao-quyen-van-hanh-cho-doi-tac-moi-truoc-lan-song-siet-chat-ban-quyen-so",
    image: "https://cdn-1.tramanime.com/images/2026/05/1779036352823-5ip4YCkfnuB2RGE.png",
    date: "18 THG 5, 2026",
    excerpt: "Làn sóng bản quyền số tại Việt Nam đang có những chuyển biến rõ nét khi các website xem phim không phép lớn lần lượt thông báo những thay đổi quan trọng trong ban điều hành.",
    category: "community"
  },
  {
    title: "Movie Doraemon 2026 đạt doanh thu ấn tượng nhưng đối mặt với tình trạng quay lén ngay trong ngày chiếu sớm",
    url: "https://tramanime.com/post/movie-doraemon-2026-dat-doanh-thu-an-tuong-nhung-doi-mat-voi-tinh-trang-quay-len-ngay-trong-ngay-chieu-som",
    slug: "movie-doraemon-2026-dat-doanh-thu-an-tuong-nhung-doi-mat-voi-tinh-trang-quay-len-ngay-trong-ngay-chieu-som",
    image: "https://cdn-1.tramanime.com/images/2026/05/1779008841648-gtt8yMAIUcRVrYS.png",
    date: "18 THG 5, 2026",
    excerpt: "Mặc dù liên tục phá vỡ các kỷ lục phòng vé trong ngày đầu tiên ra mắt, bom tấn hoạt hình Movie Doraemon 2026 hiện đang phải kêu gọi người hâm mộ nâng cao ý thức.",
    category: "anime"
  },
  {
    title: "Thành phố Hồ Chí Minh cũng sẽ được lên sóng trong tập đặc biệt của Doraemon đến Việt Nam!",
    url: "https://tramanime.com/post/thanh-pho-ho-chi-minh-cung-se-duoc-len-song-trong-tap-dac-biet-cua-doraemon-den-viet-nam",
    slug: "thanh-pho-ho-chi-minh-cung-se-duoc-len-song-trong-tap-dac-biet-cua-doraemon-den-viet-nam",
    image: "https://cdn-1.tramanime.com/images/2026/05/1778932118272-Xzh3x1sLCXoITED.png",
    date: "18 THG 5, 2026",
    excerpt: "Nhà sản xuất vừa hé lộ hình ảnh hậu trường đầy thú vị cho thấy những danh lam thắng cảnh quen thuộc tại TP.HCM sẽ xuất hiện trong hành trình tiếp theo của Mèo Máy Doraemon.",
    category: "anime"
  }
];

const FALLBACK_TRENDING: NewsItem[] = [
  {
    title: "5 phút để biến \"bản quyền\" thành \"vi phạm bản quyền\": Góc khuất quy trình vận hành của các trang xem anime lậu tại Việt Nam qua lời kể của người trong cuộc",
    url: "https://tramanime.com/post/5-phut-de-bien-ban-quyen-thanh-vi-pham-ban-quyen-goc-khuat-quy-trinh-van-hanh-cua-cac-trang-xem-anime-lau-tai-viet-nam-qua-loi-ke-cua-nguoi-trong-cuoc",
    slug: "5-phut-de-bien-ban-quyen-thanh-vi-pham-ban-quyen-goc-khuat-quy-trinh-van-hanh-cua-cac-trang-xem-anime-lau-tai-viet-nam-qua-loi-ke-cua-nguoi-trong-cuoc",
    image: "https://cdn-1.tramanime.com/images/2026/05/1779106470743-7OotkHiA6niE35y.png",
    category: "community"
  },
  {
    title: "Một trong những trang xem anime lậu lớn nhất Việt Nam, AnimeVsub sẽ có nguy cơ phải đóng cửa!?",
    url: "https://tramanime.com/post/mot-trong-nhung-trang-xem-anime-lau-lon-nhat-viet-nam-animevsub-co-nguy-co-phai-dong-cua",
    slug: "mot-trong-nhung-trang-xem-anime-lau-lon-nhat-viet-nam-animevsub-co-nguy-co-phai-dong-cua",
    image: "https://cdn-1.tramanime.com/images/2026/05/1778245425692-2o2tZz3uRZsCcJe.png",
    category: "community"
  }
];

// Helper to determine category from keywords
function detectCategory(title: string, excerpt: string): 'anime' | 'manga' | 'novel' | 'game' | 'community' {
  const content = (title + ' ' + excerpt).toLowerCase();
  if (content.includes('game') || content.includes('playstation') || content.includes('nintendo') || content.includes('rpg') || content.includes('mobile')) {
    return 'game';
  }
  if (content.includes('manga') || content.includes('truyện tranh') || content.includes('chap') || content.includes('tác giả')) {
    return 'manga';
  }
  if (content.includes('novel') || content.includes('light novel') || content.includes('tiểu thuyết')) {
    return 'novel';
  }
  if (content.includes('cộng đồng') || content.includes('bản quyền') || content.includes('vietsub') || content.includes('drama') || content.includes('tranh cãi') || content.includes('lậu')) {
    return 'community';
  }
  return 'anime';
}

// Clean and decode Next-optimized image URLs
function cleanImageUrl(img: string): string {
  if (!img) return 'https://picsum.photos/600/350?random=moenews';
  if (img.startsWith('/_next/image?url=')) {
    const match = img.match(/url=([^&]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }
  if (img.startsWith('/')) {
    return `https://tramanime.com${img}`;
  }
  return img;
}

export async function GET(req?: NextRequest) {
  try {
    const query = req ? new URL(req.url).searchParams.get('q') : null;
    const category = req ? new URL(req.url).searchParams.get('category') : null;
    
    let targetUrl = 'https://tramanime.com/';
    if (query) {
      targetUrl = `https://tramanime.com/moi-cap-nhat?q=${encodeURIComponent(query)}`;
    } else if (category && category !== 'all') {
      if (category === 'reel') {
        targetUrl = 'https://tramanime.com/reel';
      } else {
        targetUrl = `https://tramanime.com/category/${category}`;
      }
    }

    const res = await fetch(targetUrl, {
      next: { revalidate: 120 }, // cache for 2 minutes for search flexibility
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error('Fetch failed');

    const html = await res.text();
    
    // 1. Scrape all standard posts on the homepage using regex
    const posts: NewsItem[] = [];
    const seenSlugs = new Set<string>();
    const aTagRegex = /<a[^>]*href=["']\/post\/([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    
    while ((match = aTagRegex.exec(html)) !== null) {
      const slug = match[1];
      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);
      
      const innerHtml = match[2];
      
      // Extract image
      const imgMatch = innerHtml.match(/src=["']([^"']+)["']/i);
      const rawImage = imgMatch ? imgMatch[1] : '';
      const image = cleanImageUrl(rawImage);
      
      // Extract title
      let title = '';
      const altMatch = innerHtml.match(/alt=["']([^"']+)["']/i);
      if (altMatch && altMatch[1]) {
        title = altMatch[1];
      } else {
        const h3Match = innerHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
        if (h3Match) {
          title = h3Match[1].replace(/<[^>]*>/g, '').trim();
        }
      }
      title = title.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').trim();
      if (!title) continue; // skip card if no title
      
      // Extract date (check inside this card or surroundings)
      const dateMatch = innerHtml.match(/(\d+\s+thg\s+\d+,\s+\d+)/i);
      const date = dateMatch ? dateMatch[1] : 'Mới cập nhật';
      
      // Extract excerpt
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      const allParagraphs: string[] = [];
      let pM;
      while ((pM = pRegex.exec(innerHtml)) !== null) {
        allParagraphs.push(pM[1].replace(/<[^>]*>/g, '').trim());
      }
      let excerpt = allParagraphs.find(p => p.length > 20 && !p.match(/\d+\s+thg/i)) || '';
      excerpt = excerpt.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').trim();
      
      const category = detectCategory(title, excerpt);
      
      posts.push({
        title,
        url: `https://tramanime.com/post/${slug}`,
        slug,
        image,
        date,
        excerpt,
        category
      });
    }

    // 2. Scrape the Trending section (Bảng xếp hạng / Đang xu hướng)
    const trending: NewsItem[] = [];
    const trendingHeader = "Đang xu hướng";
    const headerIdx = html.indexOf(trendingHeader);
    
    if (headerIdx !== -1) {
      const sectionHtml = html.slice(headerIdx, headerIdx + 30000);
      const trendRegex = /<a[^>]*href=["']\/post\/([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
      let trendMatch;
      const seenTrend = new Set<string>();
      
      while ((trendMatch = trendRegex.exec(sectionHtml)) !== null) {
        const slug = trendMatch[1];
        if (seenTrend.has(slug)) continue;
        seenTrend.add(slug);
        
        const innerHtml = trendMatch[2];
        
        let title = '';
        const altMatch = innerHtml.match(/alt=["']([^"']+)["']/i);
        if (altMatch && altMatch[1]) {
          title = altMatch[1];
        } else {
          const h3Match = innerHtml.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i) || innerHtml.match(/<p[^>]*class="[^"]*font-semibold[^"]*">([\s\S]*?)<\/p>/i);
          if (h3Match) {
            title = h3Match[1].replace(/<[^>]*>/g, '').trim();
          }
        }
        title = title.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').trim();
        if (!title) continue;
        
        const imgMatch = innerHtml.match(/src=["']([^"']+)["']/i);
        const image = cleanImageUrl(imgMatch ? imgMatch[1] : '');
        
        const category = detectCategory(title, '');
        
        trending.push({
          title,
          url: `https://tramanime.com/post/${slug}`,
          slug,
          image,
          category
        });
      }
    }

    // If parsing was successful and we found posts
    if (posts.length > 0) {
      if (query || (category && category !== 'all')) {
        // Return search or category results directly in the latest array
        return NextResponse.json({
          success: true,
          spotlight: [],
          latest: posts,
          trending: trending.length > 0 ? trending.slice(0, 9) : posts.slice(0, 9),
          fallback: false
        });
      }

      // Spotlight is the first 6 articles in the main grid
      const spotlight = posts.slice(0, 6);
      
      // Trending list from parsing
      const trendingList = trending.length > 0 ? trending.slice(0, 9) : posts.slice(4, 12);
      
      // Latest is the rest of the chronological feed, excluding spotlight items and trending items
      const spotlightSlugs = new Set(spotlight.map(s => s.slug));
      const trendingSlugs = new Set(trendingList.map(t => t.slug));
      
      const latest = posts.filter(p => !spotlightSlugs.has(p.slug) && !trendingSlugs.has(p.slug)).slice(0, 24);
      
      return NextResponse.json({
        success: true,
        spotlight,
        latest: latest.length > 0 ? latest : posts.slice(6, 20),
        trending: trendingList,
        fallback: false
      });
    }

    throw new Error('Not enough parsed posts');
  } catch (error) {
    console.error('API scraping tramanime.com failed, utilizing fallback structures:', error);
    return NextResponse.json({
      success: true,
      spotlight: FALLBACK_SPOTLIGHT,
      latest: FALLBACK_LATEST,
      trending: FALLBACK_TRENDING,
      fallback: true
    });
  }
}
