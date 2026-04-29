const fs = require('fs');
let code = fs.readFileSync('src/pages/Writings.tsx', 'utf8');

code = code.replace(
  /\{isModalOpen && \(\n\s*<div className="fixed inset-0 bg-black\/50 flex items-center justify-center z-50">/,
  `{isModalOpen && (\n          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">`
);

fs.writeFileSync('src/pages/Writings.tsx', code);
