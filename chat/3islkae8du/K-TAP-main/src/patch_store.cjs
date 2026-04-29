const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

// Replace [...state.writings, new] with [new, ...state.writings]
code = code.replace(
  /writings: \[\.\.\.state\.writings, \{ \.\.\.writing, id, date \} as Writing\]/,
  `writings: [{ ...writing, id, date } as Writing, ...state.writings]`
);

code = code.replace(
  /books: \[\.\.\.state\.books, \{ \.\.\.book, id \} as Book\]/,
  `books: [{ ...book, id } as Book, ...state.books]`
);

code = code.replace(
  /suggestions: \[\.\.\.state\.suggestions, \{ \.\.\.suggestion, id \} as Suggestion\]/,
  `suggestions: [{ ...suggestion, id } as Suggestion, ...state.suggestions]`
);

code = code.replace(
  /polls: \[\.\.\.state\.polls, \{ \.\.\.poll, id, totalVotes: 0 \} as Poll\]/,
  `polls: [{ ...poll, id, totalVotes: 0 } as Poll, ...state.polls]`
);

code = code.replace(
  /interviews: \[\.\.\.state\.interviews, \{ \.\.\.interview, id \} as Interview\]/,
  `interviews: [{ ...interview, id } as Interview, ...state.interviews]`
);

code = code.replace(
  /announcements: \[\.\.\.state\.announcements, \{ \.\.\.announcement, id, date \} as Announcement\]/,
  `announcements: [{ ...announcement, id, date } as Announcement, ...state.announcements]`
);

fs.writeFileSync('src/store/useStore.ts', code);
