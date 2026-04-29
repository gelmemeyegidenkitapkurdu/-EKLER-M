const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

// Add created_at to new items in store so they sort correctly immediately
code = code.replace(
  /books: \[\{ \.\.\.book, id \} as Book, \.\.\.state\.books\]/,
  `books: [{ ...book, id, created_at: new Date().toISOString() } as Book, ...state.books]`
);

code = code.replace(
  /suggestions: \[\{ \.\.\.suggestion, id \} as Suggestion, \.\.\.state\.suggestions\]/,
  `suggestions: [{ ...suggestion, id, created_at: new Date().toISOString() } as Suggestion, ...state.suggestions]`
);

code = code.replace(
  /polls: \[\{ \.\.\.poll, id, totalVotes: 0 \} as Poll, \.\.\.state\.polls\]/,
  `polls: [{ ...poll, id, totalVotes: 0, created_at: new Date().toISOString() } as Poll, ...state.polls]`
);

code = code.replace(
  /interviews: \[\{ \.\.\.interview, id \} as Interview, \.\.\.state\.interviews\]/,
  `interviews: [{ ...interview, id, created_at: new Date().toISOString() } as Interview, ...state.interviews]`
);

fs.writeFileSync('src/store/useStore.ts', code);
