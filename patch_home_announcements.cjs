const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Change displayed announcements to 3
code = code.replace(
  /const displayedAnnouncements = showAllAnnouncements \? sortedAnnouncements : sortedAnnouncements\.slice\(0, 2\);/,
  `const displayedAnnouncements = sortedAnnouncements.slice(0, 3);`
);

// Add selectedAnnouncement state
code = code.replace(
  /const \[showAllAnnouncements, setShowAllAnnouncements\] = useState\(false\);/,
  `const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);\n  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);`
);

// Update click handler on displayed announcements
code = code.replace(
  /onClick=\{() => setShowAllAnnouncements\(true\)\}/g,
  `onClick={() => setSelectedAnnouncement(ann)}`
);

// Add date to displayed announcements
code = code.replace(
  /<p className="text-gray-600 line-clamp-2">\{ann\.content\}<\/p>\n\s*<\/div>\n\s*<\/div>\n\s*<\/motion\.div>/g,
  `<p className="text-gray-600 line-clamp-2">{ann.content}</p>\n                <div className="text-right mt-2 text-xs text-gray-400 font-medium">\n                  {new Date(ann.date).toLocaleDateString('tr-TR')}\n                </div>\n              </div>\n            </div>\n          </motion.div>`
);

// Add date to all announcements modal
code = code.replace(
  /<p className="text-gray-700 whitespace-pre-wrap">\{ann\.content\}<\/p>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>/g,
  `<p className="text-gray-700 whitespace-pre-wrap">{ann.content}</p>\n                  <div className="text-right mt-4 text-xs text-gray-400 font-medium">\n                    {new Date(ann.date).toLocaleDateString('tr-TR')}\n                  </div>\n                </div>\n              </div>\n            </div>`
);

// Add selected announcement modal
const selectedModalCode = `
      {/* Selected Announcement Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl my-8 p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>

              <div className="flex items-start gap-6 mt-4">
                {selectedAnnouncement.image && (
                  <img
                    src={selectedAnnouncement.image}
                    alt=""
                    className="w-32 h-32 object-cover rounded-lg shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-700 mb-2">{selectedAnnouncement.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <User size={14} />
                    <span>{selectedAnnouncement.author}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">{selectedAnnouncement.content}</p>
                  <div className="text-right mt-6 text-sm text-gray-400 font-medium">
                    {new Date(selectedAnnouncement.date).toLocaleDateString('tr-TR')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
`;

code = code.replace(
  /\{showAllAnnouncements && \(/,
  `${selectedModalCode}\n\n      {showAllAnnouncements && (`
);

fs.writeFileSync('src/pages/Home.tsx', code);
