const fs = require('fs');
let code = fs.readFileSync('src/api/client.ts', 'utf8');

code = code.replace(
  /function generateId\(\) \{\n  const timestamp = Date\.now\(\)\.toString\(\)\.padStart\(15, '0'\);\n  const random = Math\.random\(\)\.toString\(36\)\.substring\(2, 8\);\n  return `\$\{timestamp\}-\$\{random\}`;\n\}\n  return Math\.random\(\)\.toString\(36\)\.slice\(2\);\n\}/,
  `function generateId() {
  const timestamp = Date.now().toString().padStart(15, '0');
  const random = Math.random().toString(36).substring(2, 8);
  return \`\${timestamp}-\${random}\`;
}`
);

fs.writeFileSync('src/api/client.ts', code);
