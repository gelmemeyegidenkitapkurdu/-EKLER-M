import { Link, Outlet, useLocation } from 'react-router-dom';
import { Sparkles } from '../components/ui/Sparkles';
import { useStore } from '../store/useStore';
import { LogIn, LogOut, User } from 'lucide-react';
import headerBg from '../assets/header-bg.jpg';

export const MainLayout = () => {
  const { isAdmin, logout } = useStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-pink-50/30 font-serif text-gray-800 relative overflow-x-hidden">
      
      {/* Header */}
      <header className="relative bg-white/90 backdrop-blur-sm shadow-sm z-10">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center relative">
          
          {/* Admin Controls (Top Right) */}
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="p-2 hover:bg-pink-100 rounded-full transition-colors" title="Profil Düzenle">
                  <User size={20} className="text-pink-600" />
                </Link>
                <button onClick={() => void logout()} className="p-2 hover:bg-pink-100 rounded-full transition-colors" title="Çıkış Yap">
                  <LogOut size={20} className="text-pink-600" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:bg-pink-100 rounded-full transition-colors" title="Admin Girişi">
                <LogIn size={20} className="text-pink-600" />
              </Link>
            )}
          </div>

          {/* Title Area */}
          <div className="relative w-full max-w-5xl mx-auto mb-8 rounded-3xl overflow-hidden shadow-xl min-h-[280px] flex flex-col items-center justify-center group">
            
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img src={headerBg} alt="Header Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Sparkles */}
            <Sparkles />
            
            {/* Shine Strip Behind Text */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 animate-shine blur-md"></div>
            </div>
            
            {/* Silver Title */}
            <div className="relative z-10 px-1 w-full text-center flex items-center justify-center h-full">
              <Link 
                to="/" 
                className="inline-block font-bold tracking-wider hover:scale-105 transition-transform duration-500 whitespace-nowrap"
                style={{
                  fontSize: 'clamp(0.6rem, 3.8vw, 4rem)',
                  background: 'linear-gradient(to bottom, #E5E7EB, #9CA3AF, #4B5563)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))',
                  lineHeight: '1.2',
                  width: '100%'
                }}
              >
                GELMEMEYEGİDENKİTAPKURDU
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm md:text-base font-medium relative z-20">
            {[
              { path: '/', label: 'Ana Sayfa' },
              { path: '/writings', label: 'Yazılar' },
              { path: '/books', label: 'Sohbet' },
              { path: '/suggestions', label: 'Öneriler' },
              { path: '/polls', label: 'Anketler' },
              { path: '/interviews', label: 'Röportajlar' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'bg-pink-500 text-white shadow-lg transform -translate-y-1'
                    : 'hover:bg-pink-50 text-gray-600 hover:text-pink-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10 min-h-[calc(100vh-200px)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-6 mt-auto relative z-10 border-t border-pink-100">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2026 Gelmemeyegidenkitapkurdu. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
};
