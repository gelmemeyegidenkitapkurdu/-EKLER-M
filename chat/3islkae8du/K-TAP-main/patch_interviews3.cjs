const fs = require('fs');
let code = fs.readFileSync('src/pages/Interviews.tsx', 'utf8');

code = code.replace(
  /<input\s+type="file"\s+accept="image\/\*"\s+onChange=\{handlePhotoUpload\}\s+className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"\s+\/>/,
  `<input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={isUploading}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {isUploading && <span className="text-sm text-purple-600 mt-2 block">Yükleniyor...</span>}`
);

fs.writeFileSync('src/pages/Interviews.tsx', code);
