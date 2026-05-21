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
  console.log("Length of HTML:", html.length);
  
  // Let's find tags in post page
  const tagLinks = [];
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const link = match[1];
    if (link.includes('/tag/') && !tagLinks.includes(link)) {
      tagLinks.push(link);
    }
  }
  
  console.log("Tags found in post page:", tagLinks);
  
  // Let's print out the text around the tag links to see how they are formatted
  for (const tag of tagLinks) {
    const idx = html.indexOf(tag);
    if (idx !== -1) {
      console.log(`Context for ${tag}:`);
      console.log(html.slice(idx - 100, idx + 200));
      console.log("------------------------");
    }
  }
}

main().catch(console.error);
