import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, X, Upload, FileText, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '../utils/imageCompression';
import { sortByNewest } from '../utils/sortByNewest';

export const Books = () => {
  const { books, isAdmin, addBook, updateBook, deleteBook } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState('');
  const [pdfName, setPdfName] = useState('');

  const handleOpenModal = (book?: any) => {
    if (book) {
      setEditingId(book.id);
      setTitle(book.title);
      setDescription(book.description);
      setCover(book.cover);
      setPdfName(book.pdf);
    } else {
      setEditingId(null);
      setTitle('');
      setDescription('');
      setCover('');
      setPdfName('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bookData = {
      title,
      description,
      cover: cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=750&fit=crop',
      pdf: pdfName || 'mock.pdf'
    };

    if (editingId) {
      updateBook(editingId, bookData);
    } else {
      addBook(bookData);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    setTitle(''); setDescription(''); setCover(''); setPdfName('');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bu kitabı silmek istediğinize emin misiniz?')) {
      deleteBook(id);
    }
  };

  const handleEdit = (e: React.MouseEvent, book: any) => {
    e.stopPropagation();
    handleOpenModal(book);
  };

  const [isUploading, setIsUploading] = useState(false);

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
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('PDF boyutu çok büyük! Lütfen 2MB\'dan küçük bir dosya seçin.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfName(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sortedBooks = sortByNewest(books);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-purple-700">Kitaplar</h2>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} /> Kitap Ekle
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {sortedBooks.map((book) => (
          <motion.div
            key={book.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all group relative"
          >
            {isAdmin && (
              <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleEdit(e, book)}
                  className="p-1.5 bg-white/90 rounded-full text-blue-600 hover:bg-blue-50 shadow-sm"
                  title="Düzenle"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, book.id)}
                  className="p-1.5 bg-white/90 rounded-full text-red-600 hover:bg-red-50 shadow-sm"
                  title="Sil"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}

            <div className="aspect-[2/3] overflow-hidden relative">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                <p className="text-white text-sm mb-4 line-clamp-3">{book.description}</p>
                {book.pdf?.startsWith('data:') ? (
                  <a 
                    href={book.pdf} 
                    download={`${book.title}.pdf`}
                    className="bg-white text-pink-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-pink-50 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    PDF İndir
                  </a>
                ) : (
                  <button 
                    className="bg-gray-200 text-gray-500 px-4 py-2 rounded-full text-sm font-bold cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Bu kitap için geçerli bir PDF dosyası yüklenmemiş. Lütfen düzenleyip yeni bir PDF yükleyin.');
                    }}
                  >
                    PDF Yok
                  </button>
                )}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-gray-800 truncate">{book.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold text-purple-700">
                  {editingId ? 'Kitabı Düzenle' : 'Yeni Kitap Ekle'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kitap İsmi</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Resmi</label>
                  <div className="flex items-center gap-4">
                    {cover && <img src={cover} alt="Preview" className="h-20 w-14 object-cover rounded" />}
                    <label className="flex-1 cursor-pointer border border-gray-300 rounded-lg p-2 hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600">
                      <Upload size={18} />
                      <span>Resim Seç</span>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={isUploading} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PDF Dosyası</label>
                  <label className="cursor-pointer border border-gray-300 rounded-lg p-2 hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 w-full">
                    <FileText size={18} />
                    <span>{pdfName || 'PDF Seç'}</span>
                    <input type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
                  </label>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {editingId ? 'Güncelle' : 'Kitabı Ekle'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
