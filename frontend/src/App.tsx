import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { MenuPage } from './components/MenuPage';
import { CampaignsPage } from './components/CampaignsPage';
import { ProfilePage } from './components/ProfilePage';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginPage } from './components/AdminLoginPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { API_URL } from './config';
import { Toaster } from 'sonner';

function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/menu')) return 'menu';
    if (path.startsWith('/campaigns')) return 'campaigns';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/contact')) return 'contact';
    return 'home';
  };

  return (
    <div className="min-h-screen">
      <Navigation 
        currentPage={getCurrentPage()} 
        onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)}
        onAdminClick={() => navigate('/admin')}
      />
      <Toaster richColors />
      {children}
    </div>
  );
}

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileInitialTab, setProfileInitialTab] = useState<'login' | 'register'>('login');

  const navigate = useNavigate();

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
    document.title = "CuCu's Coffee & Cake - Premium Coffee Experience";
    window.scrollTo(0, 0);
  }, [isLoading]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAdminLoggedIn(false);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-[#8B5E3C] animate-pulse">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <HomePage 
            onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)} 
            onNavigateToRegister={() => {
              setProfileInitialTab('register');
              navigate('/profile');
            }} 
          />
        </MainLayout>
      } />
      
      <Route path="/menu" element={<MainLayout><MenuPage /></MainLayout>} />
      <Route path="/campaigns" element={<MainLayout><CampaignsPage /></MainLayout>} />
      <Route path="/profile" element={<MainLayout><ProfilePage initialTab={profileInitialTab} /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
      
      {/* Auth Routes */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Admin Route */}
      <Route path="/admin" element={
        isAdminLoggedIn ? (
          <AdminDashboard 
            onLogout={handleLogout} 
            onNavigateHome={() => navigate('/')} 
          />
        ) : (
          <AdminLoginPage 
            onLogin={() => setIsAdminLoggedIn(true)} 
            onBack={() => navigate('/')} 
          />
        )
      } />

      {/* Catch all - Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}