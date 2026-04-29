const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(
  /\{!showAllAnnouncements && announcements\.length > 2 && \(/,
  `{!showAllAnnouncements && announcements.length > 3 && (`
);

fs.writeFileSync('src/pages/Home.tsx', code);
