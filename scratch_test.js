const fs = require('fs');

try {
  const html = fs.readFileSync('temp_anime.html', 'utf8');
  
  console.log("=== EXAMINING H1 TAGS (Titles) ===");
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (h1Match) h1Match.forEach(h => console.log(h));

  console.log("\n=== EXAMINING TARGET TEXTS IN CONTEXT ===");
  const targets = ["Chibi Godzilla no Gyakushuu 3", "Đang phát sóng", "Hãng phim (Studio)", " MAL", "Pie in the sky"];
  targets.forEach(target => {
    const idx = html.indexOf(target);
    if (idx !== -1) {
      console.log(`\n--- CONTEXT FOR "${target}" ---`);
      console.log(html.slice(idx - 150, idx + 250));
    }
  });
} catch (e) {
  console.error(e);
}
