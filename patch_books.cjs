const fs = require('fs');
let code = fs.readFileSync('src/pages/Books.tsx', 'utf8');

code = code.replace(
  /import \{ motion, AnimatePresence \} from 'framer-motion';/,
  `import { motion, AnimatePresence } from 'framer-motion';\nimport { compressImage } from '../utils/imageCompression';`
);

code = code.replace(
  /const handleCoverUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\n    \}\n  \};/,
  `const [isUploading, setIsUploading] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const compressedBase64 = await compressImage(file, 800, 1200, 0.8);
        setCover(compressedBase64);
      } catch (error) {
        console.error('Image compression failed:', error);
        alert('Resim yüklenirken bir hata oluştu.');
      } finally {
        setIsUploading(false);
      }
    }
  };`
);

code = code.replace(
  /<input type="file" accept="image\/\*" onChange=\{handleCoverUpload\} className="hidden" \/>/,
  `<input type="file" accept="image/*" onChange={handleCoverUpload} disabled={isUploading} className="hidden" />`
);

code = code.replace(
  /<span>Kapak Fotoğrafı Seç<\/span>/,
  `<span>{isUploading ? 'Yükleniyor...' : 'Kapak Fotoğrafı Seç'}</span>`
);

fs.writeFileSync('src/pages/Books.tsx', code);
