const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

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
        setAnnImage(compressedBase64);
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
  /<input\s+type="file"\s+accept="image\/\*"\s+onChange=\{handleImageUpload\}\s+className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"\s+\/>/,
  `<input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isUploading && <span className="text-sm text-purple-600 mt-2 block">Yükleniyor...</span>}`
);

fs.writeFileSync('src/pages/Home.tsx', code);
