const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

code = code.replace(
  /image: "https:\/\/images\.unsplash\.com\/photo-1544716278-ca5e3f4abd8c\?w=500&h=500&fit=crop",/,
  `image: "",`
);

fs.writeFileSync('src/store/useStore.ts', code);
