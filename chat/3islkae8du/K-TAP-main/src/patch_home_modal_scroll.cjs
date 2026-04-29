const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Fix scroll issue for Selected Announcement Modal
code = code.replace(
  /<div className="fixed inset-0 bg-black\/50 flex items-center justify-center z-\[60\] p-4 overflow-y-auto">/,
  `<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">`
);

code = code.replace(
  /className="bg-white w-screen min-h-screen flex flex-col relative shadow-2xl p-8 md:p-12"/,
  `className="bg-white w-screen h-screen flex flex-col relative shadow-2xl p-8 md:p-12 overflow-y-auto"`
);

// Fix scroll issue for All Announcements Modal
code = code.replace(
  /<div className="fixed inset-0 bg-black\/50 flex items-center justify-center z-50 p-4 overflow-y-auto">/,
  `<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">`
);

code = code.replace(
  /className="bg-white w-screen min-h-screen flex flex-col relative shadow-2xl p-6 md:p-12"/,
  `className="bg-white w-screen h-screen flex flex-col relative shadow-2xl p-6 md:p-12 overflow-y-auto"`
);

fs.writeFileSync('src/pages/Home.tsx', code);
