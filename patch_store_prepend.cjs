const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

// Change append back to prepend so new items go to the top
code = code.replace(
  /writings: \[\.\.\.state\.writings, \{ \.\.\.writing, id, date \} as Writing\]/,
  `writings: [{ ...writing, id, date } as Writing, ...state.writings]`
);

code = code.replace(
  /books: \[\.\.\.state\.books, \{ \.\.\.book, id, created_at: new Date\(\)\.toISOString\(\) \} as Book\]/,
  `books: [{ ...book, id, created_at: new Date().toISOString() } as Book, ...state.books]`
);

code = code.replace(
  /suggestions: \[\.\.\.state\.suggestions, \{ \.\.\.suggestion, id, created_at: new Date\(\)\.toISOString\(\) \} as Suggestion\]/,
  `suggestions: [{ ...suggestion, id, created_at: new Date().toISOString() } as Suggestion, ...state.suggestions]`
);

code = code.replace(
  /polls: \[\.\.\.state\.polls, \{ \.\.\.poll, id, totalVotes: 0, created_at: new Date\(\)\.toISOString\(\) \} as Poll\]/,
  `polls: [{ ...poll, id, totalVotes: 0, created_at: new Date().toISOString() } as Poll, ...state.polls]`
);

code = code.replace(
  /interviews: \[\.\.\.state\.interviews, \{ \.\.\.interview, id, created_at: new Date\(\)\.toISOString\(\) \} as Interview\]/,
  `interviews: [{ ...interview, id, created_at: new Date().toISOString() } as Interview, ...state.interviews]`
);

code = code.replace(
  /announcements: \[\.\.\.state\.announcements, \{ \.\.\.announcement, id, date \} as Announcement\]/,
  `announcements: [{ ...announcement, id, date } as Announcement, ...state.announcements]`
);

fs.writeFileSync('src/store/useStore.ts', code);
