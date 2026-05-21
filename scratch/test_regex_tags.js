const fetch = require('node-fetch');

async function main() {
  const postSlug = 'sieu-anime-bleach-tybw-phan-4-cong-bo-doan-video-gioi-thieu-moi-an-dinh-phat-hanh-vao-mua-he-2026';
  const url = `https://tramanime.com/post/${postSlug}`;
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  
  const tags = [];
  const tagRegex = /<a[^>]*href=["']\/tag\/([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let tagMatch;
  while ((tagMatch = tagRegex.exec(html)) !== null) {
    const slug = tagMatch[1];
    const name = tagMatch[2].replace(/<[^>]*>/g, '').replace(/#/g, '').trim();
    if (slug && name && !tags.some(t => t.slug === slug)) {
      tags.push({ slug, name });
    }
  }
  
  console.log("Matched tags using regex:", tags);
}

main().catch(console.error);
