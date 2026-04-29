const fs = require('fs');
let code = fs.readFileSync('src/api/client.ts', 'utf8');

// Replace generateId
code = code.replace(
  /function generateId\(\) \{[\s\S]*?\}/,
  `function generateId() {
  const timestamp = Date.now().toString().padStart(15, '0');
  const random = Math.random().toString(36).substring(2, 8);
  return \`\${timestamp}-\${random}\`;
}`
);

// Add order to fetchBooks
code = code.replace(
  /supabase\.from\("books"\)\.select\("\*"\)/,
  `supabase.from("books").select("*").order("id", { ascending: false })`
);

// Add order to fetchSuggestions
code = code.replace(
  /supabase\.from\("suggestions"\)\.select\("\*"\)/,
  `supabase.from("suggestions").select("*").order("id", { ascending: false })`
);

// Add order to fetchPolls
code = code.replace(
  /supabase\.from\("polls"\)\.select\("\*"\)/,
  `supabase.from("polls").select("*").order("id", { ascending: false })`
);

// Add order to fetchInterviews
code = code.replace(
  /supabase\.from\("interviews"\)\.select\("\*"\)/,
  `supabase.from("interviews").select("*").order("id", { ascending: false })`
);

fs.writeFileSync('src/api/client.ts', code);
