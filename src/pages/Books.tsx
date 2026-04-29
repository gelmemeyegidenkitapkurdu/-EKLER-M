import { useState } from 'react';
import { useStore, Dialogue } from '../store/useStore';
import { Plus, X, User, MessageSquare, Trash2, Edit, Eye } from 'lucide-react';
import { compressImage } from '../utils/imageCompression';

export const Books = () => {
  const { books, isAdmin, addBook, updateBook, deleteBook } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [participant1, setParticipant1] = useState('');
  const [participant2, setParticipant2] = useState('');
  const [photo, setPhoto] = useState('');
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<'host' | 'guest'>('host');
  const [currentText, setCurrentText] = useState('');
  const [bookViews, setBookViews] = useState('');

  const handleOpenModal = (book?: any) => {
    if (book) {
      setEditingId(book.id);
      setTitle(book.title);
      setDescription(book.description);
      setParticipant1(book.participant1);
      setParticipant2(book.participant2);
      setPhoto(book.photo);
      setDialogues(book.dialogues);
      setBookViews(book.views !== undefined ? String(book.views) : '');
    } else {
      setEditingId(null);
      setTitle('');
      setDescription('');
      setParticipant1('');
      setParticipant2('');
      setPhoto('');
      setDialogues([]);
      setBookViews('');
    }
    setIsModalOpen(true);
  };

  const handleAddDialogue = () => {
    if (!currentText.trim()) return;
    setDialogues([...dialogues, {
      id: Math.random().toString(),
      speaker: currentSpeaker,
      text: currentText
    }]);
    setCurrentText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bookData = {
      title,
      description,
      participant1,
      participant2,
      photo: photo || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
      dialogues,
      views: bookViews ? parseInt(bookViews, 10) : 0
    };

    if (editingId) {
      updateBook(editingId, bookData);
    } else {
      addBook(bookData);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    setTitle(''); setDescription(''); setParticipant1(''); setParticipant2(''); setPhoto(''); setDialogues([]); setBookViews('');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bu sohbeti silmek istediğinize emin misiniz?')) {
      deleteBook(id);
    }
  };

  const handleEdit = (e: React.MouseEvent, book: any) => {
    e.stopPropagation();
    handleOpenModal(book);
  };

  const [isUploading, setIsUploading] = useState(false);

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
  };

  const activeBook = books.find(b => b.id === selectedBook);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-purple-700">Sohbet</h2>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} /> Sohbet Ekle
          </button>
        )}
      </div>

      {/* List View */}
      <div className="grid grid-cols-2 gap-8">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book.id)}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group relative"
          >
            {isAdmin && (
              <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleEdit(e, book)}
                  className="p-1.5 bg-white/90 rounded-full text-blue-600 hover:bg-blue-50 shadow-sm"
                  title="Düzenle"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, book.id)}
                  className="p-1.5 bg-white/90 rounded-full text-red-600 hover:bg-red-50 shadow-sm"
                  title="Sil"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {/* Square Cover Image */}
            <div className="aspect-square overflow-hidden">
              <img 
                src={book.photo || book.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop'} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info */}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{book.title}</h3>
              <p className="text-sm text-gray-500 truncate">
                {book.participant1 && book.participant2 
                  ? `${book.participant1} & ${book.participant2}`
                  : book.description || ''}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <Eye size={14} />
                <span>{book.views || 0}</span>
              </div>
              {book.created_at && (
                <div className="text-xs mt-2 font-medium" style={{ color: '#f4a7b9' }}>
                  {new Date(book.created_at).toLocaleDateString('tr-TR')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail View - Full Screen */}
      {activeBook && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="bg-white w-full h-full overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10 w-full">
              <h3 className="text-xl font-bold text-purple-700 break-words min-w-0 flex-1 mr-4">{activeBook.title}</h3>
              <button onClick={() => setSelectedBook(null)} className="p-2 hover:bg-gray-100 rounded-full shrink-0">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 max-w-2xl mx-auto">
              {/* Cover Image - Full Width */}
              <div className="w-full rounded-xl overflow-hidden mb-4">
                <img 
                  src={activeBook.photo || activeBook.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop'} 
                  alt={activeBook.title}
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />
              </div>

              {/* Description - Italic */}
              <p className="text-gray-600 italic mb-4 text-base leading-relaxed break-words" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>{activeBook.description}</p>

              {/* Participants - Pink Color */}
              {activeBook.participant1 && activeBook.participant2 && (
                <p className="text-pink-500 font-semibold text-lg mb-6">
                  {activeBook.participant1} <span className="text-pink-400">&</span> {activeBook.participant2}
                </p>
              )}

              {/* Dialogues */}
              <div className="space-y-4">
                {activeBook.dialogues?.map((d, i) => (
                  <div key={d.id || i} className={`flex gap-2 ${d.speaker === 'host' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`p-3 rounded-lg max-w-[80%] break-words ${
                      d.speaker === 'host' ? 'bg-purple-100 text-purple-900' : 'bg-pink-100 text-pink-900'
                    }`} style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      <span className="font-bold text-xs block mb-1">
                        {d.speaker === 'host' ? activeBook.participant1 : activeBook.participant2}
                      </span>
                      {d.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Listeye Dön Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:from-pink-600 hover:to-purple-700 transition-all"
                >
                  Listeye Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-purple-700">
                {editingId ? 'Sohbeti Düzenle' : 'Yeni Sohbet Ekle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Katılımcı 1</label>
                    <input
                      type="text"
                      value={participant1}
                      onChange={(e) => setParticipant1(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Örn: Kitap Kurdu"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Katılımcı 2</label>
                    <input
                      type="text"
                      value={participant2}
                      onChange={(e) => setParticipant2(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Örn: Yazar"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapak Fotoğrafı</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={isUploading}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {isUploading && <span className="text-sm text-purple-600 mt-2 block">Yükleniyor...</span>}
                </div>

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-bold text-gray-700 mb-4">Diyaloglar</h4>
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                    {dialogues.map((d, i) => (
                      <div key={d.id} className={`flex gap-2 ${d.speaker === 'host' ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`p-2 rounded-lg text-sm max-w-[80%] ${
                          d.speaker === 'host' ? 'bg-purple-100 text-purple-900' : 'bg-pink-100 text-pink-900'
                        }`}>
                          <span className="font-bold text-xs block mb-1">
                            {d.speaker === 'host' ? participant1 || 'Katılımcı 1' : participant2 || 'Katılımcı 2'}
                          </span>
                          {d.text}
                        </div>
                        <button
                          type="button"
                          onClick={() => setDialogues(dialogues.filter((_, idx) => idx !== i))}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={currentSpeaker}
                      onChange={(e) => setCurrentSpeaker(e.target.value as 'host' | 'guest')}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="host">{participant1 || 'Katılımcı 1'}</option>
                      <option value="guest">{participant2 || 'Katılımcı 2'}</option>
                    </select>
                    <input
                      type="text"
                      value={currentText}
                      onChange={(e) => setCurrentText(e.target.value)}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDialogue())}
                    />
                    <button
                      type="button"
                      onClick={handleAddDialogue}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Görüntülenme Sayısı</label>
                  <input
                    type="number"
                    value={bookViews}
                    onChange={(e) => setBookViews(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors mt-4"
                >
                  {editingId ? 'Değişiklikleri Kaydet' : 'Sohbeti Kaydet'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
