const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Fix Selected Announcement Modal close button
code = code.replace(
  /className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"/,
  `className="fixed top-4 right-4 p-3 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 z-50 shadow-md"`
);

// Also fix All Announcements Modal close button just in case
code = code.replace(
  /className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"/,
  `className="fixed top-4 right-4 p-3 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 z-50 shadow-md"`
);

// Make Selected Announcement Modal fullscreen like Writings and Interviews
code = code.replace(
  /className="bg-white rounded-2xl w-full max-w-2xl my-8 p-8 relative shadow-2xl"/,
  `className="bg-white w-screen min-h-screen flex flex-col relative shadow-2xl p-8 md:p-12"`
);

// Make All Announcements Modal fullscreen
code = code.replace(
  /className="bg-white rounded-2xl w-full max-w-3xl my-8 p-6 relative shadow-2xl"/,
  `className="bg-white w-screen min-h-screen flex flex-col relative shadow-2xl p-6 md:p-12"`
);

fs.writeFileSync('src/pages/Home.tsx', code);
