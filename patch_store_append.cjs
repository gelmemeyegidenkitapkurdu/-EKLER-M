const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

// Change unshift to append so new items go to the bottom
code = code.replace(
  /writings: \[\{ \.\.\.writing, id, date \} as Writing, \.\.\.state\.writings\]/,
  `writings: [...state.writings, { ...writing, id, date } as Writing]`
);

code = code.replace(
  /books: \[\{ \.\.\.book, id, created_at: new Date\(\)\.toISOString\(\) \} as Book, \.\.\.state\.books\]/,
  `books: [...state.books, { ...book, id, created_at: new Date().toISOString() } as Book]`
);

code = code.replace(
  /suggestions: \[\{ \.\.\.suggestion, id, created_at: new Date\(\)\.toISOString\(\) \} as Suggestion, \.\.\.state\.suggestions\]/,
  `suggestions: [...state.suggestions, { ...suggestion, id, created_at: new Date().toISOString() } as Suggestion]`
);

code = code.replace(
  /polls: \[\{ \.\.\.poll, id, totalVotes: 0, created_at: new Date\(\)\.toISOString\(\) \} as Poll, \.\.\.state\.polls\]/,
  `polls: [...state.polls, { ...poll, id, totalVotes: 0, created_at: new Date().toISOString() } as Poll]`
);

code = code.replace(
  /interviews: \[\{ \.\.\.interview, id, created_at: new Date\(\)\.toISOString\(\) \} as Interview, \.\.\.state\.interviews\]/,
  `interviews: [...state.interviews, { ...interview, id, created_at: new Date().toISOString() } as Interview]`
);

code = code.replace(
  /announcements: \[\{ \.\.\.announcement, id, date \} as Announcement, \.\.\.state\.announcements\]/,
  `announcements: [...state.announcements, { ...announcement, id, date } as Announcement]`
);

fs.writeFileSync('src/store/useStore.ts', code);
