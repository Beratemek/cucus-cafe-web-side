import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { MenuPage } from './components/MenuPage';
import { CampaignsPage } from './components/CampaignsPage';
import { ProfilePage } from './components/ProfilePage';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginPage } from './components/AdminLoginPage';
import { API_URL } from './config';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'menu' | 'campaigns' | 'profile' | 'contact'>('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(true);

  // --- Sayfa Yenilendiğinde Oturum Kontrolü ---
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user.role === 'admin') {
      
            setIsAdminLoggedIn(true);
          }
        }
      } catch (error) {
        console.error("Oturum kontrol hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, isAdminMode, isAdminLoggedIn]);

  useEffect(() => {
    document.title = "CuCu's Coffee & Cake - Premium Coffee Experience";
  }, []);

  const handleNavigateToRegister = () => {
    setProfileInitialTab('register');
    setCurrentPage('profile');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="text-[#8B5E3C] animate-pulse">Yükleniyor...</div>
    </div>;
  }

  // --- ADMIN MODU YÖNETİMİ ---
  if (isAdminMode) {
    if (isAdminLoggedIn) {
      return <AdminDashboard 
        // 1. ÇIKIŞ YAP (Tamamen siler ve atar)
        onLogout={() => {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setIsAdminLoggedIn(false);
          setIsAdminMode(false);
          setCurrentPage('home');
        }} 
        
        // 2. ANASAYFAYA DÖN (Oturumu SİLMEDEN sadece siteye döner)
        onNavigateHome={() => {
          setIsAdminMode(false); // Admin ekranını kapat
          setCurrentPage('home'); // Ana sayfayı göster
          // DİKKAT: setIsAdminLoggedIn(false) DEMİYORUZ! Oturum cepte kalıyor.
        }}
      />;
    } else {
      return <AdminLoginPage 
        onLogin={() => setIsAdminLoggedIn(true)}
        onBack={() => setIsAdminMode(false)}
      />;
    }
  }

  // --- NORMAL SİTE GÖRÜNÜMÜ ---
  return (
    <div className="min-h-screen">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        // Yönetici Paneline tıklandığında:
        onAdminClick={() => {
          setIsAdminMode(true);
          // Eğer zaten giriş yapmışsa (token varsa) direkt dashboard açılacak
          // App.tsx başındaki useEffect bunu zaten kontrol ediyor.
        }}
      />
      
      {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} onNavigateToRegister={handleNavigateToRegister} />}
      {currentPage === 'menu' && <MenuPage />}
      {currentPage === 'campaigns' && <CampaignsPage />}
      {currentPage === 'profile' && <ProfilePage initialTab={profileInitialTab} />}
      {currentPage === 'contact' && <ContactPage />}
    </div>
  );
}