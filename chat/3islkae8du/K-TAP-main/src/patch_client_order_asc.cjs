const fs = require('fs');
let code = fs.readFileSync('src/api/client.ts', 'utf8');

// Change all orders to sort by ID ascending (oldest first, newest at the bottom)
code = code.replace(
  /supabase\.from\("writings"\)\.select\("\*"\)\.order\("id", \{ ascending: false \}\)/,
  `supabase.from("writings").select("*").order("id", { ascending: true })`
);

code = code.replace(
  /supabase\.from\("books"\)\.select\("\*"\)\.order\("id", \{ ascending: false \}\)/,
  `supabase.from("books").select("*").order("id", { ascending: true })`
);

code = code.replace(
  /supabase\.from\("suggestions"\)\.select\("\*"\)\.order\("id", \{ ascending: false \}\)/,
  `supabase.from("suggestions").select("*").order("id", { ascending: true })`
);

code = code.replace(
  /supabase\.from\("polls"\)\.select\("\*"\)\.order\("id", \{ ascending: false \}\)/,
  `supabase.from("polls").select("*").order("id", { ascending: true })`
);

code = code.replace(
  /supabase\.from\("interviews"\)\.select\("\*"\)\.order\("id", \{ ascending: false \}\)/,
  `supabase.from("interviews").select("*").order("id", { ascending: true })`
);

code = code.replace(
  /supabase\.from\("announcements"\)\.select\("\*"\)\.order\("id", \{ ascending: false \}\)/,
  `supabase.from("announcements").select("*").order("id", { ascending: true })`
);

fs.writeFileSync('src/api/client.ts', code);
