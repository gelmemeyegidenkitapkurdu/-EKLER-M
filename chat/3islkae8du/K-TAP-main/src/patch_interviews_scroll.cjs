const fs = require('fs');
let code = fs.readFileSync('src/pages/Interviews.tsx', 'utf8');

// Fix the scroll issue by removing overflow-y-auto from the backdrop and adding it to the modal content container
code = code.replace(
  /<div className="fixed inset-0 bg-black\/60 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto">/,
  `<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">`
);

code = code.replace(
  /className="bg-white w-screen min-h-screen flex flex-col relative shadow-2xl"/,
  `className="bg-white w-screen h-screen flex flex-col relative shadow-2xl overflow-y-auto"`
);

// Also fix Writings.tsx just in case
let writingsCode = fs.readFileSync('src/pages/Writings.tsx', 'utf8');
writingsCode = writingsCode.replace(
  /<div className="fixed inset-0 bg-black\/50 flex items-center justify-center z-50 p-4">/,
  `<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">`
);
fs.writeFileSync('src/pages/Writings.tsx', writingsCode);

fs.writeFileSync('src/pages/Interviews.tsx', code);
