const fs = require('fs');
let code = fs.readFileSync('src/api/client.ts', 'utf8');

code = code.replace(
  /image:\n\s*row\.image \?\?\n\s*"https:\/\/images\.unsplash\.com\/photo-1544716278-ca5e3f4abd8c\?w=500&h=500&fit=crop",/,
  `image: row.image || ""`
);

fs.writeFileSync('src/api/client.ts', code);
