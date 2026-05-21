const fs = require('fs');

function extractExactArticleBody(html) {
  const marker = 'the-article-body text-zinc-700 dark:text-zinc-200">';
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) return '';
  
  const contentStart = startIdx + marker.length;
  
  let divCount = 1;
  let currentIdx = contentStart;
  
  while (divCount > 0 && currentIdx < html.length) {
    const nextOpen = html.indexOf('<div', currentIdx);
    const nextClose = html.indexOf('</div>', currentIdx);
    
    if (nextClose === -1) {
      break;
    }
    
    if (nextOpen !== -1 && nextOpen < nextClose) {
      divCount++;
      currentIdx = nextOpen + 4;
    } else {
      divCount--;
      if (divCount === 0) {
        return html.slice(contentStart, nextClose);
      }
      currentIdx = nextClose + 6;
    }
  }
  
  return '';
}

async function test() {
  try {
    const html = fs.readFileSync('/home/niyaki/.gemini/antigravity/brain/d7a58ffa-7973-48bf-a074-848afb07dd8a/scratch/raw_post.html', 'utf8');
    
    let exactBody = extractExactArticleBody(html);
    
    // Let's find images
    const imgRegex = /<img[^>]*src=["']([^"']+)["']/gi;
    let match;
    console.log("Original images:");
    while ((match = imgRegex.exec(exactBody)) !== null) {
      console.log("-", match[1]);
    }
    
    // Decode images
    let cleaned = exactBody.replace(/\/_next\/image\?url=([^&]+)([^"'>]*)/gi, (m, urlParam) => {
      return decodeURIComponent(urlParam);
    });
    
    console.log("\nDecoded images:");
    const imgRegex2 = /<img[^>]*src=["']([^"']+)["']/gi;
    let match2;
    while ((match2 = imgRegex2.exec(cleaned)) !== null) {
      console.log("-", match2[1]);
    }
  } catch (err) {
    console.error(err);
  }
}

test();
