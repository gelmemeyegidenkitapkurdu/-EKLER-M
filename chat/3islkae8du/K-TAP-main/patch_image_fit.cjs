const fs = require('fs');

// Fix Interviews.tsx
let interviewsCode = fs.readFileSync('src/pages/Interviews.tsx', 'utf8');
interviewsCode = interviewsCode.replace(
  /<div className="w-full max-h-\[400px\] overflow-hidden rounded-2xl shadow-lg mb-6">\s*<img\s*src=\{activeInterview\.photo\}\s*alt=\{activeInterview\.title\}\s*className="w-full h-full object-cover"\s*\/>\s*<\/div>/,
  `<div className="w-full max-h-[600px] flex justify-center overflow-hidden rounded-2xl shadow-lg mb-6 bg-white/50">
                    <img 
                      src={activeInterview.photo} 
                      alt={activeInterview.title} 
                      className="max-w-full max-h-[600px] object-contain"
                    />
                  </div>`
);
fs.writeFileSync('src/pages/Interviews.tsx', interviewsCode);

// Fix Writings.tsx
let writingsCode = fs.readFileSync('src/pages/Writings.tsx', 'utf8');
writingsCode = writingsCode.replace(
  /<div className="h-64 md:h-96 w-full relative">\s*<img\s*src=\{writings\.find\(w => w\.id === selectedWriting\)\?\.image\}\s*alt=""\s*className="w-full h-full object-cover"\s*\/>/,
  `<div className="h-64 md:h-[500px] w-full relative bg-gray-100 flex justify-center">
                    <img
                      src={writings.find(w => w.id === selectedWriting)?.image}
                      alt=""
                      className="max-w-full h-full object-contain"
                    />`
);
fs.writeFileSync('src/pages/Writings.tsx', writingsCode);

