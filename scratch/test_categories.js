const fetch = require('node-fetch');

async function main() {
  const res = await fetch('https://tramanime.com/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  console.log("Length of HTML:", html.length);
  
  // Find if there are links containing '/category/' or '/tag/'
  const categoryLinks = [];
  const tagLinks = [];
  
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const url = match[1];
    if (url.includes('/category/') && !categoryLinks.includes(url)) {
      categoryLinks.push(url);
    }
    if (url.includes('/tag/') && !tagLinks.includes(url)) {
      tagLinks.push(url);
    }
  }
  
  console.log("Category Links found:", categoryLinks);
  console.log("Tag Links found (first 10):", tagLinks.slice(0, 10));
}

main().catch(console.error);
