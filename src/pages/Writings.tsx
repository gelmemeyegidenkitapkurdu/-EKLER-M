import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, X, Image as ImageIcon, User, Trash2, Edit, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '../utils/imageCompression';
import { sortByNewest } from '../utils/sortByNewest';

export const Writings = () => {
  const { writings, isAdmin, addWriting, updateWriting, deleteWriting } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWriting, setSelectedWriting] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [views, setViews] = useState('');

  const handleOpenModal = (writing?: any) => {
    if (writing) {
      setEditingId(writing.id);
      setTitle(writing.title);
      setAuthor(writing.author);
      setContent(writing.content);
      setImage(writing.image);
      setViews(writing.views !== undefined ? String(writing.views) : '');
    } else {
      setEditingId(null);
      setTitle('');
      setAuthor('');
      setContent('');
      setImage('');
      setViews('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const writingData = {
      title,
      author,
      content,
      image: image || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=500&fit=crop',
      status: 'published' as const,
      views: views ? parseInt(views, 10) : 0
    };

    if (editingId) {
      updateWriting(editingId, writingData);
    } else {
      addWriting(writingData);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    setTitle(''); setAuthor(''); setContent(''); setImage(''); setViews('');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bu yazıyı silmek istediğinize emin misiniz? Geri alınamaz!')) {
      deleteWriting(id);
    }
  };

  const handleEdit = (e: React.MouseEvent, writing: any) => {
    e.stopPropagation();
    handleOpenModal(writing);
  };

  const [isUploading, setIsUploading] = useState(false);

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
  };

  const sortedWritings = sortByNewest(writings);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-purple-700">Yazılar</h2>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} /> Yazı Ekle
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {sortedWritings.map((writing) => (
          <motion.div
            key={writing.id}
            layoutId={writing.id}
            onClick={() => setSelectedWriting(writing.id)}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group border border-purple-100 relative"
          >
            {isAdmin && (
              <div className="absolute top-2 right-2 z-20 flex gap-2">
                <button
                  onClick={(e) => handleEdit(e, writing)}
                  className="p-2 bg-white/90 rounded-full text-blue-600 hover:bg-blue-50 shadow-sm"
                  title="Düzenle"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, writing.id)}
                  className="p-2 bg-white/90 rounded-full text-red-600 hover:bg-red-50 shadow-sm"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            
            <div className="aspect-square overflow-hidden relative">
              <img
                src={writing.image}
                alt={writing.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-sm font-medium">Okumak için tıkla</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-purple-700 mb-2 line-clamp-1">{writing.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <User size={14} />
                <span>{writing.author}</span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">{writing.content}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                <Eye size={14} />
                <span>{writing.views || 0}</span>
              </div>
              <div className="text-xs mt-2 font-medium" style={{ color: '#f4a7b9' }}>
                {new Date(writing.date).toLocaleDateString('tr-TR')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-purple-700">
                  {editingId ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yazar</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fotoğraf</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {image ? (
                      <img src={image} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-500">
                        <ImageIcon size={32} className="mb-2" />
                        <span>{isUploading ? 'Yükleniyor...' : 'Fotoğraf seçmek için tıklayın'}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Görüntülenme Sayısı</label>
                  <input
                    type="number"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingId ? 'Güncelle' : 'Yayınla'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Read Modal */}
      <AnimatePresence>
        {selectedWriting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              layoutId={selectedWriting}
              className="bg-white w-screen h-screen max-w-none max-h-none rounded-none overflow-y-auto relative"
            >
              <button
                onClick={() => setSelectedWriting(null)}
                className="fixed top-4 right-4 p-3 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 z-50 shadow-md"
              >
                <X size={24} />
              </button>
              
              {writings.find(w => w.id === selectedWriting) && (
                <>
                  <div className="h-64 md:h-[500px] w-full relative bg-gray-100 flex justify-center">
                    <img
                      src={writings.find(w => w.id === selectedWriting)?.image}
                      alt=""
                      className="max-w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                          {writings.find(w => w.id === selectedWriting)?.title}
                        </h2>
                        <div className="flex items-center gap-2 text-white/90">
                          <User size={16} />
                          <span>{writings.find(w => w.id === selectedWriting)?.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 prose prose-purple max-w-4xl mx-auto">
                    <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere text-lg leading-relaxed text-gray-700" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      {writings.find(w => w.id === selectedWriting)?.content}
                    </p>
                    <div className="flex items-center justify-between mt-8">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Eye size={16} />
                        <span>{writings.find(w => w.id === selectedWriting)?.views || 0}</span>
                      </div>
                      <div className="text-sm text-gray-400 font-medium">
                        {new Date(writings.find(w => w.id === selectedWriting)?.date || '').toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
