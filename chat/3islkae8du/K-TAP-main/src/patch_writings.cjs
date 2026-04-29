const fs = require('fs');
let code = fs.readFileSync('src/pages/Writings.tsx', 'utf8');

// 1. Grid cols
code = code.replace(
  /className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"/,
  `className="grid grid-cols-1 md:grid-cols-2 gap-6"`
);

// 2. Fullscreen modal
code = code.replace(
  /className="bg-white rounded-2xl w-full max-w-4xl max-h-\[90vh\] overflow-y-auto relative"/,
  `className="bg-white w-screen h-screen max-w-none max-h-none rounded-none overflow-y-auto relative"`
);

// 3. Close button position
code = code.replace(
  /className="absolute top-4 right-4 p-2 bg-white\/80 backdrop-blur rounded-full hover:bg-gray-100 z-10 shadow-sm"/,
  `className="fixed top-4 right-4 p-3 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 z-50 shadow-md"`
);

// 4. Image upload compression
code = code.replace(
  /import \{ motion, AnimatePresence \} from 'framer-motion';/,
  `import { motion, AnimatePresence } from 'framer-motion';\nimport { compressImage } from '../utils/imageCompression';`
);

code = code.replace(
  /const handleImageUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\n    \}\n  \};/,
  `const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const compressedBase64 = await compressImage(file, 1200, 1200, 0.8);
        setImage(compressedBase64);
      } catch (error) {
        console.error('Image compression failed:', error);
        alert('Resim yüklenirken bir hata oluştu.');
      } finally {
        setIsUploading(false);
      }
    }
  };`
);

// Add disabled state to file input
code = code.replace(
  /<input\s+type="file"\s+accept="image\/\*"\s+onChange=\{handleImageUpload\}\s+className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"\s+\/>/,
  `<input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />`
);

// Add loading text
code = code.replace(
  /<span>Fotoğraf seçmek için tıklayın<\/span>/,
  `<span>{isUploading ? 'Yükleniyor...' : 'Fotoğraf seçmek için tıklayın'}</span>`
);

fs.writeFileSync('src/pages/Writings.tsx', code);
