import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../utils/imageCompression';
import profilePlaceholder from '../assets/profile-placeholder.jpg';

export const Profile = () => {
  const { adminProfile, updateProfile } = useStore();
  const [about, setAbout] = useState(adminProfile.about);
  const [email, setEmail] = useState(adminProfile.email);
  const [instagram, setInstagram] = useState(adminProfile.instagram);
  const [image, setImage] = useState(adminProfile.image);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ about, email, instagram, image });
    alert('Profil bilgileri güncellendi!');
  };

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

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-pink-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Profil Düzenle</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profil Resmi</label>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-pink-200 shadow-sm shrink-0">
              <img src={image && image !== "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop" ? image : profilePlaceholder} alt="Profile Preview" className="w-full h-full object-cover" />
            </div>
            <label className={`flex-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-500 transition-colors relative ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center text-gray-500">
                <Upload size={24} className="mb-1" />
                <span className="text-sm">{isUploading ? 'Yükleniyor...' : 'Yeni resim seçmek için tıklayın'}</span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hakkımda Yazısı</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">İletişim E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Linki</label>
          <input
            type="url"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Save size={20} />
          Değişiklikleri Kaydet
        </button>
      </form>
    </div>
  );
};
