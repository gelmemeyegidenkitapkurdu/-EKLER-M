import { useState } from 'react';
import { useStore, Dialogue } from '../store/useStore';
import { Plus, X, User, MessageSquare, Trash2, Edit, Eye } from 'lucide-react';
import { compressImage } from '../utils/imageCompression';

export const Interviews = () => {
  const { interviews, isAdmin, addInterview, updateInterview, deleteInterview } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [interviewer, setInterviewer] = useState('');
  const [interviewee, setInterviewee] = useState('');
  const [photo, setPhoto] = useState('');
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<'host' | 'guest'>('host');
  const [currentText, setCurrentText] = useState('');
  const [interviewViews, setInterviewViews] = useState('');

  const handleOpenModal = (interview?: any) => {
    if (interview) {
      setEditingId(interview.id);
      setTitle(interview.title);
      setDescription(interview.description);
      setInterviewer(interview.interviewer);
      setInterviewee(interview.interviewee);
      setPhoto(interview.photo);
      setDialogues(interview.dialogues);
      setInterviewViews(interview.views !== undefined ? String(interview.views) : '');
    } else {
      setEditingId(null);
      setTitle('');
      setDescription('');
      setInterviewer('');
      setInterviewee('');
      setPhoto('');
      setDialogues([]);
      setInterviewViews('');
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
    const interviewData = {
      title,
      description,
      interviewer,
      interviewee,
      photo: photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=500&fit=crop',
      dialogues,
      views: interviewViews ? parseInt(interviewViews, 10) : 0
    };

    if (editingId) {
      updateInterview(editingId, interviewData);
    } else {
      addInterview(interviewData);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
    setTitle(''); setDescription(''); setInterviewer(''); setInterviewee(''); setPhoto(''); setDialogues([]); setInterviewViews('');
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bu röportajı silmek istediğinize emin misiniz?')) {
      deleteInterview(id);
    }
  };

  const handleEdit = (e: React.MouseEvent, interview: any) => {
    e.stopPropagation();
    handleOpenModal(interview);
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

  const activeInterview = interviews.find(i => i.id === selectedInterview);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-purple-700">Röportajlar</h2>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} /> Röportaj Ekle
          </button>
        )}
      </div>

      {/* List View */}
      <div className="grid grid-cols-2 gap-8">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            onClick={() => setSelectedInterview(interview.id)}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group relative"
          >
            {isAdmin && (
              <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleEdit(e, interview)}
                  className="p-1.5 bg-white/90 rounded-full text-blue-600 hover:bg-blue-50 shadow-sm"
                  title="Düzenle"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, interview.id)}
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
                src={interview.photo} 
                alt={interview.interviewee} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            
            <div className="p-5">
              {/* Names */}
              <div className="flex items-center justify-between mb-3 text-sm font-bold text-pink-600">
                <span>{interview.interviewer}</span>
                <span className="text-gray-400">vs</span>
                <span>{interview.interviewee}</span>
              </div>
              
              {/* Title & Description Preview */}
              <h3 className="text-lg font-bold text-gray-800 mb-2">{interview.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{interview.description}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                <Eye size={14} />
                <span>{interview.views || 0}</span>
              </div>
              <div className="text-xs mt-2 font-medium" style={{ color: '#f4a7b9' }}>
                {new Date(interview.created_at || Date.now()).toLocaleDateString('tr-TR')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Read Modal - NEW DESIGN */}
        {selectedInterview && activeInterview && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div
              className="bg-white w-screen h-screen flex flex-col relative shadow-2xl overflow-y-auto"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              <button
                onClick={() => setSelectedInterview(null)}
                className="fixed top-4 right-4 p-3 bg-white/80 rounded-full hover:bg-white transition-colors z-50 shadow-md"
              >
                <X size={24} className="text-purple-600" />
              </button>

              {/* Content Container with Gradient Background */}
              <div className="flex-1 p-8 md:p-12" style={{ background: 'linear-gradient(135deg, #f8e1ff 0%, #ffffff 50%, #e1c9ff 100%)' }}>
                
                {/* Interview Header */}
                <div className="text-center mb-8 overflow-hidden">
                  <h2 className="text-4xl font-bold text-purple-600 mb-4 break-words" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>{activeInterview.title}</h2>
                  <div className="w-full max-h-[600px] flex justify-center overflow-hidden rounded-2xl shadow-lg mb-6 bg-white/50">
                    <img 
                      src={activeInterview.photo} 
                      alt={activeInterview.title} 
                      className="max-w-full max-h-[600px] object-contain"
                    />
                  </div>
                  
                  {/* Participants Info */}
                  <div className="flex flex-col md:flex-row justify-between bg-purple-50/50 p-4 rounded-xl mb-8 gap-4">
                    <div className="text-center p-2 bg-purple-100/50 rounded-lg flex-1">
                      <div className="font-bold text-purple-700">{activeInterview.interviewer}</div>
                      <div className="text-sm text-gray-600">Röportaj Yapan</div>
                    </div>
                    <div className="text-center p-2 bg-pink-100/50 rounded-lg flex-1">
                      <div className="font-bold text-pink-600">{activeInterview.interviewee}</div>
                      <div className="text-sm text-gray-600">Konuk</div>
                    </div>
                  </div>

                  <p className="text-lg italic text-gray-600 leading-relaxed max-w-2xl mx-auto break-words" style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                    {activeInterview.description}
                  </p>
                  <div className="text-right mt-4 text-sm text-gray-400 font-medium">
                    {new Date(activeInterview.created_at || Date.now()).toLocaleDateString('tr-TR')}
                  </div>
                </div>

                {/* Chat Content */}
                <div className="max-w-3xl mx-auto space-y-6">
                  {activeInterview.dialogues.map((dialogue) => (
                    <div
                      key={dialogue.id}
                      className={`flex ${dialogue.speaker === 'host' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[80%] p-6 rounded-2xl shadow-md relative ${
                          dialogue.speaker === 'host'
                            ? 'bg-purple-600 text-white rounded-tl-none'
                            : 'bg-pink-500 text-white rounded-tr-none'
                        }`}
                      >
                        <div className="text-xs font-bold mb-2 opacity-80">
                          {dialogue.speaker === 'host' ? activeInterview.interviewer : activeInterview.interviewee}
                        </div>
                        <p className="text-lg leading-relaxed font-medium break-words whitespace-pre-wrap">{dialogue.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setSelectedInterview(null)}
                  className="block mx-auto mt-12 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  Listeye Dön
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Add/Edit Modal (Admin) */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold text-purple-700">
                  {editingId ? 'Röportajı Düzenle' : 'Yeni Röportaj Ekle'}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Röportaj Yapan</label>
                      <input
                        type="text"
                        value={interviewer}
                        onChange={(e) => setInterviewer(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Konuk</label>
                      <input
                        type="text"
                        value={interviewee}
                        onChange={(e) => setInterviewee(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
                              {d.speaker === 'host' ? interviewer || 'Host' : interviewee || 'Guest'}
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
                        <option value="host">Host</option>
                        <option value="guest">Guest</option>
                      </select>
                      <input
                        type="text"
                        value={currentText}
                        onChange={(e) => setCurrentText(e.target.value)}
                        placeholder="Mesaj yazın..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDialogue())}
                      />
                      <button
                        type="button"
                        onClick={handleAddDialogue}
                        className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Görüntülenme Sayısı</label>
                    <input
                      type="number"
                      value={interviewViews}
                      onChange={(e) => setInterviewViews(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors mt-4"
                  >
                    {editingId ? 'Değişiklikleri Kaydet' : 'Röportajı Kaydet'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
