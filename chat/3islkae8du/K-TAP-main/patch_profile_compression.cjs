const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

code = code.replace(
  /const compressedBase64 = await compressImage\(file, 800, 800, 0\.8\);/,
  `const compressedBase64 = await compressImage(file, 1200, 1200, 0.8);`
);

fs.writeFileSync('src/pages/Profile.tsx', code);
