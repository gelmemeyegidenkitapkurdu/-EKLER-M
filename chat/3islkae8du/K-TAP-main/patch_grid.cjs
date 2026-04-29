const fs = require('fs');

// Fix Writings.tsx
let writingsCode = fs.readFileSync('src/pages/Writings.tsx', 'utf8');
writingsCode = writingsCode.replace(
  /className="grid grid-cols-1 md:grid-cols-2 gap-6"/,
  `className="grid grid-cols-2 gap-6"`
);
fs.writeFileSync('src/pages/Writings.tsx', writingsCode);

// Fix Interviews.tsx
let interviewsCode = fs.readFileSync('src/pages/Interviews.tsx', 'utf8');
interviewsCode = interviewsCode.replace(
  /className="grid grid-cols-1 md:grid-cols-2 gap-8"/,
  `className="grid grid-cols-2 gap-8"`
);
fs.writeFileSync('src/pages/Interviews.tsx', interviewsCode);

