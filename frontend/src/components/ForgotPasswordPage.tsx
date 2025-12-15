import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { API_URL } from '../config';
import { ArrowLeft, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/login')}
        className="absolute top-4 left-4 text-[#8B5E3C] hover:bg-[#E6D3BA]/20"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Geri Dön
      </Button>

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-[#E6D3BA]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-[#8B5E3C]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2D1B12] mb-2">Şifremi Unuttum</h1>
          <p className="text-[#8B5E3C]">Lütfen e-posta adresinizi girin. Size şifre sıfırlama linki göndereceğiz.</p>
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
            <label className="text-sm font-medium text-[#2D1B12]">E-posta Adresi</label>
            <Input
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl border-[#E6D3BA] focus:ring-[#8B5E3C]"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-[#8B5E3C] hover:bg-[#2D1B12] text-white rounded-xl text-base font-medium transition-colors"
          >
            {isLoading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
          </Button>
        </form>
      </div>
    </div>
  );
}
