const fs = require('fs');
let code = fs.readFileSync('src/pages/Writings.tsx', 'utf8');

code = code.replace(
  /<div className="fixed inset-0 bg-black\/50 flex items-center justify-center z-50 p-4">/g,
  `<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">`
);

fs.writeFileSync('src/pages/Writings.tsx', code);
