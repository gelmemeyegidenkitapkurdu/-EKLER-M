const fs = require('fs');
let code = fs.readFileSync('src/store/useStore.ts', 'utf8');

code = code.replace(
  /function createLocalId\(\) \{[\s\S]*?return Math\.random\(\)\.toString\(36\)\.slice\(2\);\n\}/,
  `function createLocalId() {
  const timestamp = Date.now().toString().padStart(15, '0');
  const random = Math.random().toString(36).substring(2, 8);
  return \`\${timestamp}-\${random}\`;
}`
);

fs.writeFileSync('src/store/useStore.ts', code);
