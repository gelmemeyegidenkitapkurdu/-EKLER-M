const fs = require('fs');
let code = fs.readFileSync('src/pages/Interviews.tsx', 'utf8');

// Add break-words and whitespace-pre-wrap to ensure long text wraps correctly inside the chat bubbles
code = code.replace(
  /<p className="text-lg leading-relaxed font-medium">\{dialogue\.text\}<\/p>/,
  `<p className="text-lg leading-relaxed font-medium break-words whitespace-pre-wrap">{dialogue.text}</p>`
);

// Also ensure the container allows wrapping
code = code.replace(
  /className=\{`max-w-\[80%\] p-6 rounded-2xl shadow-md relative \$\{/,
  `className={\`max-w-[85%] md:max-w-[80%] p-6 rounded-2xl shadow-md relative \${`
);

fs.writeFileSync('src/pages/Interviews.tsx', code);
