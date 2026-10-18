import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, LogOut, Award, Gift, Star, Sparkles, Check, Mail, Lock, Phone, ArrowLeft, KeyRound, Coffee, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { toast } from "sonner";

import { API_URL, DEMO_MODE, DEMO_NOTICE } from '../config';
import { DemoNotice } from './DemoNotice';

// Backend API Adresi
const AUTH_API_URL = `${API_URL}/auth`;

interface ProfilePageProps {
  initialTab?: 'login' | 'register';
  onLoginSuccess?: () => void;
}

interface Coupon {
  _id: string;
  code: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  expiryDate: string;
  validCategories?: string[];
  validSizes?: string[];
}

export function ProfilePage({ initialTab = 'login', onLoginSuccess }: ProfilePageProps) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Görünüm Modu: 'tabs' (Giriş/Kayıt), 'forgot' (Email Gir), 'reset' (Yeni Şifre)
  const [authView, setAuthView] = useState<'tabs' | 'forgot' | 'reset'>('tabs');

  // Kullanıcı Bilgileri
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    points: 0,
    sadakat_no: '',
  });

  const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);

  // Form State'leri
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Şifre Sıfırlama State'leri
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetToken, setResetToken] = useState(''); // Backend'den gelen token
  const [newPassword, setNewPassword] = useState('');

  // Puan Çevirme Dialog State
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // Sayfa Yüklenmesi
  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token && !DEMO_MODE) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (response.ok) {
        setUserInfo({
          name: `${data.user.name} ${data.user.surname}`,
          email: data.user.email,
          phone: '',
          points: data.user.points || 0,
          sadakat_no: data.user.sadakat_no
        });
        setIsLoggedIn(true);
        fetchCoupons(token);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Kullanıcı bilgisi alınamadı", error);
    }
  };

  const fetchCoupons = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/wheel/coupons`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setUserCoupons(data.coupons);
      }
    } catch (error) {
      console.error("Kuponlar alınamadı", error);
    }
  };

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (DEMO_MODE) { toast.info(DEMO_NOTICE); return; }
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();

      if (response.ok) {
        if (rememberMe) localStorage.setItem('token', data.token);
        else sessionStorage.setItem('token', data.token);

        // Admin kontrolü - Admin ise direkt admin paneline yönlendir
        if (data.user.role === 'admin') {
          navigate('/admin');
          window.location.reload();
          return;
        }

        // Normal kullanıcı girişi
        fetchCoupons(data.token);
        setUserInfo({
          name: `${data.user.name} ${data.user.surname}`,
          email: data.user.email,
          phone: '',
          points: data.user.points || 0,
          sadakat_no: data.user.sadakat_no
        });
        setIsLoggedIn(true);
        onLoginSuccess?.(); // Notify parent component
      } else {
        toast.error(`Giriş Başarısız: ${data.message}`);
      }
    } catch (error) {
      console.error("Login Hatası:", error);
      toast.error("Sunucuya bağlanılamadı.");
    }
  };

  // --- REGISTER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (DEMO_MODE) { toast.info(DEMO_NOTICE); return; }
    const nameParts = registerName.trim().split(' ');
    const surname = nameParts.length > 1 ? nameParts.pop() : '';
    const name = nameParts.join(' ');

    if (!name || !surname) { toast.warning("Lütfen Ad ve Soyad giriniz."); return; }

    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name, surname: surname, email: registerEmail, password: registerPassword
        })
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success("Kayıt Başarılı! Hoş geldiniz.");
        fetchCoupons(data.token);
        setUserInfo({
          name: `${data.user.name} ${data.user.surname}`,
          email: data.user.email,
          phone: registerPhone,
          points: data.user.points || 0,
          sadakat_no: data.user.sadakat_no || ''
        });
        setIsLoggedIn(true);
        onLoginSuccess?.(); // Notify parent component
      } else {
        toast.error(`Hata: ${data.message}`);
      }
    } catch (error) {
      console.error("Kayıt Hatası:", error);
      toast.error("Sunucuya bağlanılamadı.");
    }
  };

  // --- LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserInfo({ name: '', email: '', phone: '', points: 0, sadakat_no: '' });
    setAuthView('tabs');
    window.location.href = import.meta.env.BASE_URL; // Force page reload to update navigation
  };

  // --- ŞİFRE UNUTTUM (ADIM 1) ---
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (DEMO_MODE) { toast.info(DEMO_NOTICE); return; }
    if (!forgotEmail) {
      toast.warning("Lütfen e-posta adresinizi girin.");
      return;
    }

    // 60 saniye timeout (Render cold start için)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        // Başarılı - Kullanıcıya email gönderildiğini söyle
        toast.success(`Şifre sıfırlama linki ${forgotEmail} adresinize gönderildi!`);
        toast.info("Lütfen email kutunuzu (ve spam klasörünü) kontrol edin.");
        setAuthView('tabs'); // Giriş ekranına dön
        setForgotEmail(''); // Email alanını temizle
      } else {
        toast.error("Hata: " + (data.message || 'Bir hata oluştu'));
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Şifre unuttum hatası:", error);

      if (error.name === 'AbortError') {
        toast.error("İstek zaman aşımına uğradı. Lütfen daha sonra tekrar deneyin.");
      } else {
        toast.error("Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.");
      }
    }
  };

  // --- ŞİFRE SIFIRLAMA (ADIM 2) ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (DEMO_MODE) { toast.info(DEMO_NOTICE); return; }
    if (!newPassword) { toast.warning("Lütfen yeni şifre girin."); return; }

    try {
      const response = await fetch(`${AUTH_API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword: newPassword })
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.");
        setAuthView('tabs'); // Giriş ekranına dön
        setLoginEmail(forgotEmail); // Kolaylık olsun diye emaili doldur
      } else {
        toast.error("Hata: " + data.message);
      }
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
    }
  };

  const benefits = [
    'İlk siparişinizde %20 indirim', 'Her siparişinizde puan kazanın', 'Her 500 Puana 1 kahve hediye',
    'Özel kampanyalardan ilk siz haberdar olun',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-50">
      {/* Hero */}
      <div className="bg-white py-16 sm:py-20 border-b border-[#E6D3BA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm text-[#8B5E3C] tracking-widest uppercase mb-4 block">Account</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#2D1B12] mb-4 tracking-tight">Hesabım</h1>
          <p className="text-lg text-[#8B5E3C] max-w-2xl mx-auto">
            {isLoggedIn ? `Hoş geldiniz, ${userInfo.name.split(' ')[0]}!` : 'Giriş yapın veya yeni hesap oluşturun'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {isLoggedIn ? (
          // --- GİRİŞ YAPILMIŞ EKRAN ---
          <div className="space-y-8">
            <div className="bg-white border border-[#E6D3BA] p-8 rounded-3xl shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#8B5E3C] to-[#2D1B12] rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl text-[#2D1B12] mb-1">{userInfo.name}</h2>
                    <p className="text-[#8B5E3C]">{userInfo.email}</p>
                    <p className="text-[#8B5E3C]">Müşteri Numarası: <strong>{userInfo.sadakat_no}</strong></p>
                  </div>
                </div>
                <Button onClick={handleLogout} variant="outline" className="border-[#C8A27A] text-[#8B5E3C] hover:bg-[#E6D3BA] rounded-full">
                  <LogOut className="w-4 h-4 mr-2" /> Çıkış Yap
                </Button>
              </div>

              <div className="bg-gradient-to-br from-[#E6D3BA] to-[#E6D3BA] p-6 rounded-2xl border border-[#C8A27A]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#8B5E3C] mb-1 flex items-center gap-2"><Award className="w-5 h-5" /> Toplam Puanınız</p>
                    <p className="text-5xl text-[#2D1B12]">{userInfo.points}</p>
                    <p className="text-sm text-[#8B5E3C] mt-2">
                      {userInfo.points >= 500
                        ? "Tebrikler! Ücretsiz kahve alabilirsiniz."
                        : `Bir sonraki hediyeye ${Math.max(0, 500 - userInfo.points)} puan kaldı`}
                    </p>

                    {userInfo.points >= 500 && (
                      <Button
                        onClick={() => setIsConvertDialogOpen(true)}
                        className="mt-4 bg-[#2D1B12] text-white hover:bg-[#8B5E3C] border-0 gap-2"
                      >
                        <Coffee className="w-4 h-4" /> 500 Puanı Kahveye Çevir
                      </Button>
                    )}

                  </div>
                  <div className="text-6xl">🏆</div>
                </div>
              </div>
            </div>

            {/* Puan Çevirme Dialog */}
            <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
              <DialogContent className="sm:max-w-md bg-[#FFF9F5] border-none shadow-2xl rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-[#2D1B12] flex items-center gap-2">
                    ☕ Ücretsiz Kahve Fırsatı
                  </DialogTitle>
                  <DialogDescription className="text-[#8B5E3C] pt-2">
                    Harika haber! Biriktirdiğiniz puanları kullanarak ücretsiz kahve kuponu oluşturabilirsiniz.
                  </DialogDescription>
                </DialogHeader>

                <div className="bg-white p-4 rounded-xl border border-[#E6D3BA] my-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#8B5E3C]">Mevcut Puan:</span>
                    <span className="font-bold text-[#2D1B12]">{userInfo.points}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#8B5E3C]">Gerekli Puan:</span>
                    <span className="font-bold text-red-500">-500</span>
                  </div>
                  <div className="h-px bg-[#E6D3BA] my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-[#8B5E3C]">Kalan Puan:</span>
                    <span className="font-bold text-[#2D1B12]">{userInfo.points - 500}</span>
                  </div>
                </div>

                <DialogFooter className="flex gap-2 sm:gap-0">
                  <Button
                    variant="ghost"
                    onClick={() => setIsConvertDialogOpen(false)}
                    className="text-[#8B5E3C] hover:bg-[#E6D3BA]/20 hover:text-[#2D1B12]"
                  >
                    Vazgeç
                  </Button>
                  <Button
                    onClick={async () => {
                      setIsConverting(true);
                      try {
                        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                        const response = await fetch(`${API_URL}/wheel/convert-points`, {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const data = await response.json();

                        if (response.ok) {
                          toast.success("Kupon başarıyla oluşturuldu! 'Kuponlarım' sekmesinden görüntüleyebilirsiniz.");
                          setUserInfo(prev => ({ ...prev, points: data.remainingPoints }));
                          fetchCoupons(token!);
                          setIsConvertDialogOpen(false);
                        } else {
                          toast.error(data.message || "İşlem başarısız oldu.");
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Bir hata oluştu.");
                      } finally {
                        setIsConverting(false);
                      }
                    }}
                    disabled={isConverting}
                    className="bg-[#2D1B12] hover:bg-[#8B5E3C] text-white"
                  >
                    {isConverting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Gift className="w-4 h-4 mr-2" />}
                    Onayla ve Dönüştür
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div>
              <div className="flex items-center gap-2 mb-6"><Gift className="w-6 h-6 text-[#8B5E3C]" /><h2 className="text-3xl text-[#2D1B12]">Kazanılan Kuponlarım</h2></div>
              {userCoupons.length === 0 ? (
                <div className="text-[#8B5E3C] bg-[#FAF8F5] p-6 rounded-2xl border border-[#E6D3BA] text-center">Henüz aktif bir kuponunuz yok. Fırsat çarkını çevirmeyi unutmayın!</div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {userCoupons.map((coupon) => (
                    <div key={coupon._id} className="bg-white border border-[#E6D3BA] p-6 rounded-3xl shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#8B5E3C] text-white text-xs px-3 py-1 rounded-bl-xl">Çark Hediyesi</div>
                      <div className="flex items-start justify-between mb-4 mt-2"><h3 className="text-xl font-bold text-[#2D1B12]">{coupon.discountType === 'percent' ? `%${coupon.discountValue}` : `₺${coupon.discountValue}`} İndirim</h3></div>
                      <div className="bg-[#FAF8F5] p-3 rounded-xl border border-dashed border-[#C8A27A] mb-4 text-center"><span className="font-mono text-lg font-bold text-[#2D1B12] tracking-widest select-all">{coupon.code}</span></div>
                      <p className="text-sm text-[#C8A27A] flex items-center gap-1"><Star className="w-4 h-4" /> Son Kullanma: {new Date(coupon.expiryDate).toLocaleDateString('tr-TR')}</p>
                      {(coupon.validCategories && coupon.validCategories.length > 0) || (coupon.validSizes && coupon.validSizes.length > 0) ? (
                        <div className="mt-3 pt-3 border-t border-[#E6D3BA] text-xs bg-amber-50 p-2 rounded-lg space-y-1">
                          {coupon.validCategories && coupon.validCategories.length > 0 && (
                            <p className="text-amber-800 font-semibold">📍 Sadece Standart Kahvelerde</p>
                          )}
                          {coupon.validSizes && coupon.validSizes.length > 0 && (
                            <p className="text-amber-800 font-semibold">📏 Sadece {coupon.validSizes.join(", ")} Boy Kahvelerde</p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-[#E6D3BA] p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-2 mb-6"><Sparkles className="w-5 h-5 text-[#8B5E3C]" /><h3 className="text-2xl text-[#2D1B12]">Üyelik Avantajlarınız</h3></div>
              <div className="grid sm:grid-cols-2 gap-4">{benefits.map((benefit, index) => (<div key={index} className="flex items-start gap-3"><div className="mt-1 p-1 bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] rounded-full flex-shrink-0"><Check className="w-3 h-3 text-white" /></div><span className="text-[#8B5E3C]">{benefit}</span></div>))}</div>
            </div>
          </div>
        ) : (
          // --- GİRİŞ / KAYIT / ŞİFRE SIFIRLAMA EKRANLARI ---
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="max-w-md mx-auto lg:mx-0 w-full">
              <DemoNotice className="mb-6" />

              {/* DURUM 1: LOGIN VEYA REGISTER */}
              {authView === 'tabs' && (
                <Tabs defaultValue={initialTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border border-[#E6D3BA] p-1.5 rounded-full shadow-sm">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5E3C] data-[state=active]:to-[#8B5E3C] data-[state=active]:text-white text-[#8B5E3C] rounded-full transition-all duration-300 hover:bg-[#E6D3BA]/50"
                    >
                      Giriş Yap
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5E3C] data-[state=active]:to-[#8B5E3C] data-[state=active]:text-white text-[#8B5E3C] rounded-full transition-all duration-300 hover:bg-[#E6D3BA]/50"
                    >
                      Kayıt Ol
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <div className="bg-white border border-[#E6D3BA] p-8 rounded-3xl shadow-sm">
                      <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="text-[#2D1B12]">E-posta Adresi</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-[#C8A27A] transition-colors" />
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="ornek@email.com"
                              value={loginEmail}
                              onChange={(e) => setLoginEmail(e.target.value)}
                              className="pl-11 bg-[#FAF8F5] border-[#E6D3BA] text-[#2D1B12] placeholder:text-[#C8A27A] focus:border-[#8B5E3C] focus:ring-[#C8A27A] rounded-2xl transition-all duration-200 hover:border-[#C8A27A]"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password" className="text-[#2D1B12]">Şifre</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-[#C8A27A] transition-colors" />
                            <Input
                              id="login-password"
                              type="password"
                              placeholder="••••••••"
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="pl-11 bg-[#FAF8F5] border-[#E6D3BA] text-[#2D1B12] placeholder:text-[#C8A27A] focus:border-[#8B5E3C] focus:ring-[#C8A27A] rounded-2xl transition-all duration-200 hover:border-[#C8A27A]"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <label className="flex items-center gap-2 cursor-pointer text-[#8B5E3C] hover:text-[#2D1B12] transition-colors">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="rounded border-[#C8A27A] text-[#8B5E3C] focus:ring-[#C8A27A] transition-all"
                            />
                            <span>Beni hatırla</span>
                          </label>
                          {/* ŞİFREMİ UNUTTUM BUTONU - Ayrı sayfaya yönlendir */}
                          <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-[#8B5E3C] hover:text-[#2D1B12] font-semibold transition-colors hover:underline"
                          >
                            Şifremi unuttum
                          </button>
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] hover:from-[#2D1B12] hover:to-[#2D1B12] text-white border-0 rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] py-6 text-base font-semibold"
                        >
                          Giriş Yap
                        </Button>
                      </form>
                    </div>
                  </TabsContent>

                  <TabsContent value="register">
                    <div className="bg-white border border-[#E6D3BA] p-8 rounded-3xl shadow-sm">
                      <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2"><Label htmlFor="register-name" className="text-[#2D1B12]">Ad Soyad</Label><div className="relative"><User className="absolute left-3 top-3 h-5 w-5 text-[#C8A27A]" /><Input id="register-name" type="text" placeholder="Adınız Soyadınız" value={registerName} onChange={(e) => setRegisterName(e.target.value)} className="pl-11 bg-[#FAF8F5] border-[#E6D3BA] text-[#2D1B12] placeholder:text-[#C8A27A] focus:border-[#8B5E3C] focus:ring-[#C8A27A] rounded-2xl" required /></div></div>
                        <div className="space-y-2"><Label htmlFor="register-email" className="text-[#2D1B12]">E-posta Adresi</Label><div className="relative"><Mail className="absolute left-3 top-3 h-5 w-5 text-[#C8A27A]" /><Input id="register-email" type="email" placeholder="ornek@email.com" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} className="pl-11 bg-[#FAF8F5] border-[#E6D3BA] text-[#2D1B12] placeholder:text-[#C8A27A] focus:border-[#8B5E3C] focus:ring-[#C8A27A] rounded-2xl" required /></div></div>
                        <div className="space-y-2"><Label htmlFor="register-phone" className="text-[#2D1B12]">Telefon Numarası</Label><div className="relative"><Phone className="absolute left-3 top-3 h-5 w-5 text-[#C8A27A]" /><Input id="register-phone" type="tel" placeholder="05555555555" value={registerPhone} onChange={(e) => { const onlyNums = e.target.value.replace(/[^0-9]/g, ''); setRegisterPhone(onlyNums); }} className="pl-11 bg-[#FAF8F5] border-[#E6D3BA] text-[#2D1B12] placeholder:text-[#C8A27A] focus:border-[#8B5E3C] focus:ring-[#C8A27A] rounded-2xl" required /></div></div>
                        <div className="space-y-2"><Label htmlFor="register-password" className="text-[#2D1B12]">Şifre</Label><div className="relative"><Lock className="absolute left-3 top-3 h-5 w-5 text-[#C8A27A]" /><Input id="register-password" type="password" placeholder="••••••••" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} className="pl-11 bg-[#FAF8F5] border-[#E6D3BA] text-[#2D1B12] placeholder:text-[#C8A27A] focus:border-[#8B5E3C] focus:ring-[#C8A27A] rounded-2xl" required /></div><p className="text-xs text-[#C8A27A]">Şifreniz en az 8 karakter olmalıdır</p></div>
                        <div className="flex items-start gap-2"><input type="checkbox" required className="mt-1 rounded border-[#C8A27A] text-[#8B5E3C] focus:ring-[#C8A27A]" /><label className="text-sm text-[#8B5E3C]"><a href="#" className="text-[#8B5E3C] hover:text-[#2D1B12]">Kullanım koşullarını</a> ve <a href="#" className="text-[#8B5E3C] hover:text-[#2D1B12]">gizlilik politikasını</a> okudum ve kabul ediyorum.</label></div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] hover:from-[#2D1B12] hover:to-[#2D1B12] text-white border-0 rounded-full shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] py-6 text-base font-semibold"
                        >
                          Kayıt Ol
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {/* DURUM 2: ŞİFRE UNUTTUM (EMAIL GİRME) */}
              {authView === 'forgot' && (
                <div className="bg-white border border-[#E6D3BA] p-8 rounded-3xl shadow-sm">
                  <div className="flex items-center mb-6">
                    <button onClick={() => setAuthView('tabs')} className="mr-2 text-[#8B5E3C] hover:bg-[#E6D3BA] p-2 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
                    <h3 className="text-2xl text-[#2D1B12]">Şifremi Unuttum</h3>
                  </div>
                  <p className="text-[#8B5E3C] mb-6">Lütfen hesabınıza kayıtlı e-posta adresinizi girin. Size şifrenizi sıfırlamanız için bir bağlantı (token) göndereceğiz.</p>

                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="text-[#2D1B12]">E-posta Adresi</Label>
                      <div className="relative"><Mail className="absolute left-3 top-3 h-5 w-5 text-[#C8A27A]" /><Input id="forgot-email" type="email" placeholder="ornek@email.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="pl-11 bg-[#FAF8F5] border-[#E6D3BA] text-[#2D1B12] placeholder:text-[#C8A27A] focus:border-[#8B5E3C] focus:ring-[#C8A27A] rounded-2xl" required /></div>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] hover:from-[#2D1B12] hover:to-[#2D1B12] text-white border-0 rounded-full shadow-md">Sıfırlama Bağlantısı Gönder</Button>
                  </form>
                </div>
              )}

              {/* DURUM 3: ŞİFRE SIFIRLAMA (YENİ ŞİFRE GİRME) */}
              {authView === 'reset' && (
                <div className="bg-white border border-[#E6D3BA] p-8 rounded-3xl shadow-sm">
                  <div className="flex items-center mb-6">
                    <h3 className="text-2xl text-[#2D1B12]">Yeni Şifre Belirle</h3>
                  </div>
                  <div className="p-3 bg-green-50 text-green-800 rounded-xl text-sm mb-6 border border-green-200">
                    E-posta doğrulaması başarılı! Lütfen yeni şifrenizi giriniz.
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-[#2D1B12]">Yeni Şifre</Label>
                      <div className="relative"><KeyRound className="absolute left-3 top-3 h-5 w-5 text-[#C8A27A]" /><Input id="new-password" type="password" placeholder="En az 8 karakter" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-11 bg-[#FAF8F5] border-[#E6D3BA] text-[#2D1B12] placeholder:text-[#C8A27A] focus:border-[#8B5E3C] focus:ring-[#C8A27A] rounded-2xl" required /></div>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] hover:from-[#2D1B12] hover:to-[#2D1B12] text-white border-0 rounded-full shadow-md">Şifreyi Güncelle</Button>
                  </form>
                </div>
              )}

            </div>

            <div>
              <div className="relative overflow-hidden bg-white border border-[#E6D3BA] p-8 rounded-3xl shadow-sm">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-bl-full"></div>
                <div className="relative">
                  <div className="inline-flex items-center gap-2 mb-6"><Sparkles className="w-5 h-5 text-[#8B5E3C]" /><h3 className="text-2xl text-[#2D1B12]">Üye Avantajları</h3></div>
                  <ul className="space-y-4">{benefits.map((benefit, index) => (<li key={index} className="flex items-start gap-3"><div className="mt-1 p-1 bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] rounded-full flex-shrink-0"><Check className="w-3 h-3 text-white" /></div><span className="text-[#8B5E3C]">{benefit}</span></li>))}</ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
