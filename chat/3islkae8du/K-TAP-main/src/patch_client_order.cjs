const fs = require('fs');
let code = fs.readFileSync('src/api/client.ts', 'utf8');

// Change order from id to created_at for all tables that have it
code = code.replace(
  /supabase\.from\("books"\)\.select\("\*"\)\.order\("id", \{ ascending: false \}\)/,
  `supabase.from("books").select("*").order("created_at", { ascending: false })`
);

code = code.replace(
  /supabase\.from\("suggestions"\)\.select\("\*"\)\.order\("id", \{ ascending: false \}\)/,
  `supabase.from("suggestions").select("*").order("created_at", { ascending: false })`
);

code = code.replace(
  /supabase\.from\("polls"\)\.select\("\*"\)\.order\("id", \{ ascending: false \}\)/,
  `supabase.from("polls").select("*").order("created_at", { ascending: false })`
);

code = code.replace(
  /supabase\.from\("interviews"\)\.select\("\*"\)\.order\("id", \{ ascending: false \}\)/,
  `supabase.from("interviews").select("*").order("created_at", { ascending: false })`
);

fs.writeFileSync('src/api/client.ts', code);
