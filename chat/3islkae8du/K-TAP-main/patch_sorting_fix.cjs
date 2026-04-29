const fs = require('fs');

function updateSorting(filePath, oldVar, newVar, dateField) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Replace the previous sorting logic with a more robust one that falls back to ID (which contains timestamp)
  const regex = new RegExp("const " + oldVar + " = \\[\\.\\.\\." + newVar + "\\].sort\\(\\(a, b\\) => \\{[\\s\\S]*?return dateB - dateA;\\n  \\}\\);");
  const replacement = "const " + oldVar + " = [..." + newVar + "].sort((a, b) => {\n" +
    "    const dateA = new Date(a." + dateField + " || 0).getTime();\n" +
    "    const dateB = new Date(b." + dateField + " || 0).getTime();\n" +
    "    if (dateA === dateB) {\n" +
    "      // Fallback to ID comparison (which contains timestamp) if dates are equal\n" +
    "      return (b.id || '').localeCompare(a.id || '');\n" +
    "    }\n" +
    "    return dateB - dateA;\n" +
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

