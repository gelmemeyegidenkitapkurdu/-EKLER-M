const fs = require('fs');

// 1. Writings.tsx
let writingsCode = fs.readFileSync('src/pages/Writings.tsx', 'utf8');
writingsCode = writingsCode.replace(
  /<p className="text-gray-600 text-sm line-clamp-3">\{writing\.content\}<\/p>\n\s*<\/div>\n\s*<\/motion\.div>/g,
  `<p className="text-gray-600 text-sm line-clamp-3">{writing.content}</p>\n              <div className="text-right mt-3 text-xs text-gray-400 font-medium">\n                {new Date(writing.date).toLocaleDateString('tr-TR')}\n              </div>\n            </div>\n          </motion.div>`
);
writingsCode = writingsCode.replace(
  /<p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">\n\s*\{writings\.find\(w => w\.id === selectedWriting\)\?\.content\}\n\s*<\/p>\n\s*<\/div>/g,
  `<p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">\n                      {writings.find(w => w.id === selectedWriting)?.content}\n                    </p>\n                    <div className="text-right mt-8 text-sm text-gray-400 font-medium">\n                      {new Date(writings.find(w => w.id === selectedWriting)?.date || '').toLocaleDateString('tr-TR')}\n                    </div>\n                  </div>`
);
fs.writeFileSync('src/pages/Writings.tsx', writingsCode);

// 2. Books.tsx
let booksCode = fs.readFileSync('src/pages/Books.tsx', 'utf8');
booksCode = booksCode.replace(
  /<p className="text-gray-600 text-sm line-clamp-3">\{book\.description\}<\/p>\n\s*<\/div>\n\s*<\/motion\.div>/g,
  `<p className="text-gray-600 text-sm line-clamp-3">{book.description}</p>\n              <div className="text-right mt-3 text-xs text-gray-400 font-medium">\n                {new Date(book.created_at || Date.now()).toLocaleDateString('tr-TR')}\n              </div>\n            </div>\n          </motion.div>`
);
fs.writeFileSync('src/pages/Books.tsx', booksCode);

// 3. Suggestions.tsx
let suggestionsCode = fs.readFileSync('src/pages/Suggestions.tsx', 'utf8');
suggestionsCode = suggestionsCode.replace(
  /<p className="text-gray-600 text-sm line-clamp-3">\{suggestion\.description\}<\/p>\n\s*<\/div>\n\s*<\/motion\.div>/g,
  `<p className="text-gray-600 text-sm line-clamp-3">{suggestion.description}</p>\n              <div className="text-right mt-3 text-xs text-gray-400 font-medium">\n                {new Date(suggestion.created_at || Date.now()).toLocaleDateString('tr-TR')}\n              </div>\n            </div>\n          </motion.div>`
);
fs.writeFileSync('src/pages/Suggestions.tsx', suggestionsCode);

// 4. Polls.tsx
let pollsCode = fs.readFileSync('src/pages/Polls.tsx', 'utf8');
pollsCode = pollsCode.replace(
  /<\/div>\n\s*<\/motion\.div>\n\s*\)\)\}/g,
  `</div>\n              <div className="text-right mt-4 text-xs text-gray-400 font-medium">\n                {new Date(poll.created_at || Date.now()).toLocaleDateString('tr-TR')}\n              </div>\n            </motion.div>\n        ))}`
);
fs.writeFileSync('src/pages/Polls.tsx', pollsCode);

// 5. Interviews.tsx
let interviewsCode = fs.readFileSync('src/pages/Interviews.tsx', 'utf8');
interviewsCode = interviewsCode.replace(
  /<p className="text-gray-600 text-sm line-clamp-2">\{interview\.description\}<\/p>\n\s*<\/div>\n\s*<\/motion\.div>/g,
  `<p className="text-gray-600 text-sm line-clamp-2">{interview.description}</p>\n              <div className="text-right mt-3 text-xs text-gray-400 font-medium">\n                {new Date(interview.created_at || Date.now()).toLocaleDateString('tr-TR')}\n              </div>\n            </div>\n          </motion.div>`
);
interviewsCode = interviewsCode.replace(
  /<\/div>\n\s*\{\/\* Chat Content \*\/\}/g,
  `  <div className="text-right mt-4 text-sm text-gray-400 font-medium">\n                    {new Date(activeInterview.created_at || Date.now()).toLocaleDateString('tr-TR')}\n                  </div>\n                </div>\n\n                {/* Chat Content */}`
);
fs.writeFileSync('src/pages/Interviews.tsx', interviewsCode);

