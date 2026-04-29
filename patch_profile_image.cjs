const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// Add import
code = code.replace(
  /import \{ compressImage \} from '\.\.\/utils\/imageCompression';/,
  `import { compressImage } from '../utils/imageCompression';\nimport profilePlaceholder from '../assets/profile-placeholder.jpg';`
);

// Replace image source
code = code.replace(
  /<img src=\{image\} alt="Profile Preview" className="w-full h-full object-cover" \/>/,
  `<img src={image && image !== "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop" ? image : profilePlaceholder} alt="Profile Preview" className="w-full h-full object-cover" />`
);

fs.writeFileSync('src/pages/Profile.tsx', code);
