const fs = require('fs');

function updateSorting(filePath, oldVar, newVar, dateField) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Replace the previous sorting logic with a simple ID-based sort
  // Since IDs are generated using Date.now() at the beginning, sorting by ID descending
  // will perfectly sort by exact creation time (newest first)
  const regex = new RegExp("const " + oldVar + " = \\[\\.\\.\\." + newVar + "\\].sort\\(\\(a, b\\) => \\{[\\s\\S]*?return dateB - dateA;\\n  \\}\\);");
  const replacement = "const " + oldVar + " = [..." + newVar + "].sort((a, b) => {\n" +
    "    // IDs start with a timestamp, so sorting by ID descending gives newest first\n" +
    "    return (b.id || '').localeCompare(a.id || '');\n" +
    "  });";
  
  code = code.replace(regex, replacement);
  fs.writeFileSync(filePath, code);
}

updateSorting('src/pages/Writings.tsx', 'sortedWritings', 'writings', 'date');
updateSorting('src/pages/Home.tsx', 'sortedAnnouncements', 'announcements', 'date');
updateSorting('src/pages/Books.tsx', 'sortedBooks', 'books', 'created_at');
updateSorting('src/pages/Suggestions.tsx', 'sortedSuggestions', 'suggestions', 'created_at');
updateSorting('src/pages/Polls.tsx', 'sortedPolls', 'polls', 'created_at');
updateSorting('src/pages/Interviews.tsx', 'sortedInterviews', 'interviews', 'created_at');

