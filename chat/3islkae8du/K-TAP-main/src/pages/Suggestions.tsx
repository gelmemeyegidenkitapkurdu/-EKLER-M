import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, X, ExternalLink, Upload, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { compressImage } from '../utils/imageCompression';
import { sortByNewest } from '../utils/sortByNewest';

export const Suggestions = () => {
  const { suggestions, isAdmin, addSuggestion, updateSuggestion, deleteSuggestion } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');

  const handleOpenModal = (suggestion?: any) => {
    if (suggestion) {
      setEditingId(suggestion.id);
      setTitle(suggestion.title);
      setGenre(suggestion.genre);
      setDescription(suggestion.description);
      setLink(suggestion.link);
      setImage(suggestion.image);
    } else {
      setEditingId(null);
      setTitle('');
      setGenre('');
      setDescription('');
      setLink('');
      setImage('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const suggestionData = {
      title,
      genre,
      description,
      link,
      image: image || 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&h=500&fit=crop'
    };

    if (editingId) {
      updateSuggestion(editingId, suggestionData);
    } else {
      addSuggestion(suggestionData);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    setTitle(''); setGenre(''); setDescription(''); setLink(''); setImage('');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bu öneriyi silmek istediğinize emin misiniz?')) {
      deleteSuggestion(id);
    }
  };

  const handleEdit = (e: React.MouseEvent, suggestion: any) => {
    e.stopPropagation();
    handleOpenModal(suggestion);
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        const compressedBase64 = await compressImage(file, 800, 1200, 0.8);
        setImage(compressedBase64);
      } catch (error) {
        console.error('Image compression failed:', error);
        alert('Resim yüklenirken bir hata oluştu.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const sortedSuggestions = sortByNewest(suggestions);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📚</span>
          <h2 className="text-3xl font-bold text-purple-700">Öneriler</h2>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} /> Öneri Ekle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSuggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col relative group"
          >
            {isAdmin && (
              <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleEdit(e, suggestion)}
                  className="p-1.5 bg-white/90 rounded-full text-blue-600 hover:bg-blue-50 shadow-sm"
                  title="Düzenle"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, suggestion.id)}
                  className="p-1.5 bg-white/90 rounded-full text-red-600 hover:bg-red-50 shadow-sm"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            <div className="h-48 overflow-hidden relative">
              <img
                src={suggestion.image}
                alt={suggestion.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-pink-600 shadow-sm">
                {suggestion.genre}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{suggestion.title}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-1">{suggestion.description}</p>
              <a
                href={suggestion.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-50 text-green-600 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} /> İncele
              </a>
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
                  {editingId ? 'Öneriyi Düzenle' : 'Yeni Öneri Ekle'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resim</label>
                  <div className="flex items-center gap-4">
                    {image && <img src={image} alt="Preview" className="h-16 w-16 object-cover rounded" />}
                    <label className="flex-1 cursor-pointer border border-gray-300 rounded-lg p-2 hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600">
                      <Upload size={18} />
                      <span>Resim Seç</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                    </label>
                  </div>
                </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kitap Türü</label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kitap Linki</label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="https://..."
                    required
                  />
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
                    {editingId ? 'Güncelle' : 'Öneriyi Ekle'}
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
