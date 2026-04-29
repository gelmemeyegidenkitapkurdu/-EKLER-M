const fs = require('fs');
let code = fs.readFileSync('src/pages/Interviews.tsx', 'utf8');

code = code.replace(
  /const handlePhotoUpload = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?reader\.readAsDataURL\(file\);\n    \}\n  \};/,
  `const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const compressedBase64 = await compressImage(file, 1200, 1200, 0.8);
        setPhoto(compressedBase64);
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
  /<input\s+type="file"\s+accept="image\/\*"\s+onChange=\{handlePhotoUpload\}\s+className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"\s+\/>/,
  `<input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={isUploading}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      />`
);

fs.writeFileSync('src/pages/Interviews.tsx', code);
