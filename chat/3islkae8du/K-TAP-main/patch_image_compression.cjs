const fs = require('fs');
let code = fs.readFileSync('src/utils/imageCompression.ts', 'utf8');

// Increase max width and height for profile image compression to ensure better quality
// and use webp for better compression ratio
code = code.replace(
  /export const compressImage = \(file: File, maxWidth = 800, maxHeight = 800, quality = 0\.7\): Promise<string> => \{/,
  `export const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<string> => {`
);

code = code.replace(
  /resolve\(canvas\.toDataURL\('image\/jpeg', quality\)\);/,
  `resolve(canvas.toDataURL('image/webp', quality));`
);

fs.writeFileSync('src/utils/imageCompression.ts', code);
