import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_URL } from '../config';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Doğrulama linki geçersiz.');
        return;
      }

      if (verificationAttempted.current) return;
      verificationAttempted.current = true;

      try {
        const response = await fetch(`${API_URL}/auth/verify-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          setTimeout(() => navigate('/login'), 5000); // 5 saniye sonra login'e yönlendir
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-[#E6D3BA] text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-[#8B5E3C] animate-spin mb-4" />
            <h2 className="text-xl font-bold text-[#2D1B12]">Doğrulanıyor...</h2>
            <p className="text-[#8B5E3C] mt-2">Lütfen bekleyin, e-posta adresiniz doğrulanıyor.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#2D1B12] mb-2">Başarılı!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-[#8B5E3C] mb-6">5 saniye içinde giriş sayfasına yönlendirileceksiniz...</p>
            <Button onClick={() => navigate('/login')} className="bg-[#8B5E3C] hover:bg-[#2D1B12] text-white rounded-xl">
              Giriş Yap
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#2D1B12] mb-2">Hata!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Button onClick={() => navigate('/')} variant="outline" className="border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#FAF8F5] rounded-xl">
              Anasayfaya Dön
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
