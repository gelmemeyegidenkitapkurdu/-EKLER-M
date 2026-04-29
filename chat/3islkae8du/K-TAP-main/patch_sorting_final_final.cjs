const fs = require('fs');

function updateSorting(filePath, oldVar, newVar) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Change sorting to descending (newest first, oldest at the bottom near 2026)
  const regex = new RegExp("const " + oldVar + " = \\[\\.\\.\\." + newVar + "\\].sort\\(\\(a, b\\) => \\{[\\s\\S]*?return \\(a\\.id \\|\\| ''\\)\\.localeCompare\\(b\\.id \\|\\| ''\\);\\n  \\}\\);");
  const replacement = "const " + oldVar + " = [..." + newVar + "].sort((a, b) => {\n" +
    "    // IDs start with a timestamp, so sorting by ID descending gives newest first (oldest at the bottom)\n" +
    "    return (b.id || '').localeCompare(a.id || '');\n" +
    "  });";
  
  code = code.replace(regex, replacement);
  fs.writeFileSync(filePath, code);
}

updateSorting('src/pages/Writings.tsx', 'sortedWritings', 'writings');
updateSorting('src/pages/Home.tsx', 'sortedAnnouncements', 'announcements');
updateSorting('src/pages/Books.tsx', 'sortedBooks', 'books');
updateSorting('src/pages/Suggestions.tsx', 'sortedSuggestions', 'suggestions');
updateSorting('src/pages/Polls.tsx', 'sortedPolls', 'polls');
updateSorting('src/pages/Interviews.tsx', 'sortedInterviews', 'interviews');

