const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add import
code = code.replace(
  /import \{ compressImage \} from '\.\.\/utils\/imageCompression';/,
  `import { compressImage } from '../utils/imageCompression';\nimport profilePlaceholder from '../assets/profile-placeholder.jpg';`
);

// Replace image source
code = code.replace(
  /src=\{adminProfile\.image\}/,
  `src={adminProfile.image && adminProfile.image !== "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop" ? adminProfile.image : profilePlaceholder}`
);

fs.writeFileSync('src/pages/Home.tsx', code);
