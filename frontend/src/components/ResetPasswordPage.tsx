import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { API_URL } from '../config';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Şifreler eşleşmiyor!' });
      return;
    }
    if (!token) {
        setMessage({ type: 'error', text: 'Geçersiz token!' });
        return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
            <div className="text-center text-[#2D1B12]">
                <h1 className="text-2xl font-bold mb-2">Hata</h1>
                <p>Geçersiz sıfırlama linki.</p>
                <Button variant="link" onClick={() => navigate('/')} className="mt-4 text-[#8B5E3C]">Anasayfaya Dön</Button>
            </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-[#E6D3BA]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#8B5E3C]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2D1B12] mb-2">Yeni Şifre Belirle</h1>
          <p className="text-[#8B5E3C]">Lütfen hesabınız için yeni bir şifre belirleyin.</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2D1B12]">Yeni Şifre</label>
            <div className="relative">
                <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-[#E6D3BA] focus:ring-[#8B5E3C] pr-10"
                required
                minLength={6}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2D1B12]">Şifre Tekrar</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 rounded-xl border-[#E6D3BA] focus:ring-[#8B5E3C]"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-[#8B5E3C] hover:bg-[#2D1B12] text-white rounded-xl text-base font-medium transition-colors"
          >
            {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </Button>
        </form>
      </div>
    </div>
  );
}
