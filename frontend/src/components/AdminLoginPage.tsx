import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Lock, Mail, Shield, ArrowLeft } from 'lucide-react';

import { API_URL } from '../config';

interface AdminLoginPageProps {
  onLogin: () => void;
  onBack?: () => void;
}

export function AdminLoginPage({ onLogin, onBack }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. State Tanımı (Burada sorun yoktu)
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role === 'admin') {
          
          // 2. Logic Kısmı (Burada da sorun yoktu)
          if (rememberMe) {
            // Beni Hatırla SEÇİLİ: LocalStorage (Kalıcı)
            localStorage.setItem('token', data.token);
          } else {
            // Beni Hatırla SEÇİLİ DEĞİL: SessionStorage (Geçici)
            sessionStorage.setItem('token', data.token);
          }
          
          onLogin(); 
        } else {
          alert("Giriş başarılı ancak bu panele erişim yetkiniz yok!");
        }
      } else {
        alert(`Giriş Başarısız: ${data.message}`);
      }
    } catch (error) {
      console.error("Login Hatası:", error);
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1B12] via-[#4A3022] to-[#2D1B12] flex items-center justify-center p-4 relative">
      <div
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors group cursor-pointer"
        onClick={onBack}
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Anasayfaya Dön</span>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#8B5E3C] to-[#C8A27A] rounded-full mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl text-white mb-2">Yönetici Girişi</h1>
          <p className="text-[#E6D3BA]">CuCu's Coffee & Cake</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-white">E-posta Adresi</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#C8A27A]" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@cucuscoffee.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-[#C8A27A] focus:border-[#C8A27A] focus:ring-[#C8A27A] rounded-2xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-white">Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#C8A27A]" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-[#C8A27A] focus:border-[#C8A27A] focus:ring-[#C8A27A] rounded-2xl"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-[#E6D3BA]">
                {/* 3. DÜZELTİLEN KISIM BURASI: Checkbox'ı State'e Bağladık */}
                <input 
                  type="checkbox" 
                  checked={rememberMe} // State'ten oku
                  onChange={(e) => setRememberMe(e.target.checked)} // State'i güncelle
                  className="rounded border-white/20 bg-white/10 text-[#8B5E3C] focus:ring-[#C8A27A]" 
                />
                <span>Beni hatırla</span>
              </label>
              <a href="#" className="text-[#E6D3BA] hover:text-white transition-colors">
                Şifremi unuttum
              </a>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#8B5E3C] to-[#C8A27A] hover:from-[#C8A27A] hover:to-[#8B5E3C] text-white border-0 rounded-full shadow-lg text-base py-6"
            >
              <Shield className="w-5 h-5 mr-2" />
              {isLoading ? "Giriş Yapılıyor..." : "Yönetici Olarak Giriş Yap"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/20 text-center">
            <p className="text-sm text-[#E6D3BA]">
              Sadece yetkili personel giriş yapabilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}