import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { API_URL } from "../config";

interface WheelOfFortuneProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WheelOfFortune({ isOpen, onOpenChange }: WheelOfFortuneProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dilimler
  const segments = [
    { id: 1, type: 'points', value: 10, label: '10 Puan', color: '#8B5E3C' },
    { id: 2, type: 'coupon', value: 5, label: '%5 İndirim', color: '#C8A27A' },
    { id: 3, type: 'points', value: 50, label: '50 Puan', color: '#E6D3BA' },
    { id: 4, type: 'retry',  value: 0,  label: 'Pas', color: '#2D1B12' },
    { id: 5, type: 'points', value: 100, label: '100 Puan', color: '#8B5E3C' },
    { id: 6, type: 'coupon', value: 10, label: '%10 İndirim', color: '#C8A27A' },
    { id: 7, type: 'points', value: 25, label: '25 Puan', color: '#E6D3BA' },
    { id: 8, type: 'coupon', value: 20, label: '%20 İndirim', color: '#2D1B12' },
  ];

  const degreesPerSlice = 360 / segments.length;

  useEffect(() => {
    if (isOpen) {
      setRotation(0);
      setWonPrize(null);
      setIsSpinning(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const handleSpin = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      alert("Çarkı çevirmek için lütfen giriş yapınız!");
      onOpenChange(false);
      return;
    }

    setIsSpinning(true);
    setErrorMessage(null);

    try {
      // Backend isteği
      const response = await fetch(`${API_URL}/wheel/spin`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Bir hata oluştu");
        setIsSpinning(false);
        return;
      }

      const backendReward = data.reward;
      console.log("Backend Reward:", backendReward);
      
      // Hangi dilime denk geliyor? (Değerleri logla)
      let winningIndex = segments.findIndex(s => {
        const typeMatch = s.type === backendReward.type;
        // Value karşılaştırması için her ikisini de sayıya çeviriyoruz
        const valueMatch = Number(s.value) === Number(backendReward.value);
        return typeMatch && valueMatch;
      });

      console.log("Winning Index Found:", winningIndex);

      if (winningIndex === -1) {
        console.warn("Ödül segmentlerde bulunamadı, varsayılan (Pas) seçiliyor.");
        winningIndex = 3; // Bulamazsa Pas (Index 3)
      }

      // --- DÖNÜŞ AÇISI HESAPLAMA ---
      
      const segmentAngle = 360 / segments.length; // 45 derece
      const halfSegment = segmentAngle / 2; // 22.5 derece (Tam ortalamak için)

      // Hedefin merkezine denk gelen açı (Başlangıç noktasına göre)
      // Visual 0 (Top) is aligned with Internal 0 via SVG transform
      // Rastgelelik ekle: Hedef dilimin içinde rastgele bir yere (merkezden +/- 15 derece sapma)
      const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8); 
      const targetAngle = (winningIndex * segmentAngle) + halfSegment + randomOffset;

      // Çarkın şimdiki pozisyonundan ileriye doğru dönmesi için hesaplama
      // 360 - targetAngle: İlgili noktayı 0 noktasına (Visual Top) getirmek için gereken dönüş
      const fullRotations = 360 * 5; // En az 5 tam tur
      const finalRotation = fullRotations + (360 - targetAngle); 
      
      console.log(` Target Angle: ${targetAngle}, Rotation: ${finalRotation}`);

      setRotation(finalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        setWonPrize({
          ...segments[winningIndex],
          message: backendReward.message,
          code: backendReward.code
        });
      }, 5500);

    } catch (error) {
      console.error("Çark hatası:", error);
      setErrorMessage("Bağlantı hatası oluştu.");
      setIsSpinning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-[#FFF9F5] p-6 rounded-3xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-[#2D1B12]">Fırsat Çarkı</DialogTitle>
          <DialogDescription className="text-center text-[#8B5E3C] text-sm">
            Günde 1 kez çevirme hakkın var!
          </DialogDescription>
        </DialogHeader>

        {errorMessage ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-[#2D1B12] font-bold">{errorMessage}</p>
            <Button onClick={() => onOpenChange(false)} className="mt-4 bg-[#8B5E3C] text-white">Tamam</Button>
          </div>
        ) : (
          <div className="relative flex flex-col items-center mt-8 mb-4">
            <div className="relative w-full max-w-[280px] aspect-square mx-auto">
              
              {/* POINTER (OK İŞARETİ) */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-50 filter drop-shadow-md">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="#2D1B12">
                  <path d="M12 21L4 6h16L12 21z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>

              {/* DÖNEN ÇARK */}
              <motion.div
                className="w-full h-full rounded-full relative"
                animate={{ rotate: rotation }}
                transition={{ duration: 5.5, ease: [0.22, 1, 0.36, 1] }} // Daha yumuşak duruş (cubic-bezier)
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
              >
                {/* SVG'ye doğrudan transform veriyoruz, Tailwind'e bırakmıyoruz */}
                <svg viewBox="0 0 200 200" className="w-full h-full" transform="rotate(-90)"> 
                  <circle cx="100" cy="100" r="98" fill="#FFF9F5" stroke="#2D1B12" strokeWidth="4" />
                  
                  {segments.map((seg, index) => {
                    const startAngle = index * degreesPerSlice;
                    const endAngle = (index + 1) * degreesPerSlice;
                    
                    // SVG Ark Çizimi
                    const x1 = 100 + 96 * Math.cos(Math.PI * startAngle / 180);
                    const y1 = 100 + 96 * Math.sin(Math.PI * startAngle / 180);
                    const x2 = 100 + 96 * Math.cos(Math.PI * endAngle / 180);
                    const y2 = 100 + 96 * Math.sin(Math.PI * endAngle / 180);
                    
                    // Metin Konumu (Yarıçapı biraz azalttık ki merkeze yakın olsun)
                    const midAngle = (startAngle + endAngle) / 2;
                    const textX = 100 + 60 * Math.cos(Math.PI * midAngle / 180);
                    const textY = 100 + 60 * Math.sin(Math.PI * midAngle / 180);

                    return (
                      <g key={seg.id}>
                        <path
                          d={`M100,100 L${x1},${y1} A96,96 0 0,1 ${x2},${y2} Z`}
                          fill={seg.color}
                          stroke="#FFF9F5"
                          strokeWidth="2"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill={['#E6D3BA', '#C8A27A'].includes(seg.color) ? '#2D1B12' : 'white'}
                          fontSize="9"
                          fontWeight="800"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                          style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.1)" }}
                        >
                          {seg.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </motion.div>

              {/* MERKEZ BUTON */}
              <button
                onClick={handleSpin}
                disabled={isSpinning || !!wonPrize}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white border-4 border-[#2D1B12] shadow-xl flex items-center justify-center z-40 active:scale-95 transition-transform"
              >
                {isSpinning ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#2D1B12]" />
                ) : (
                  <span className="text-[10px] font-black text-[#2D1B12]">ÇEVİR</span>
                )}
              </button>
            </div>

            {/* KAZANMA EKRANI */}
            <AnimatePresence>
              {wonPrize && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl z-50 backdrop-blur-sm"
                >
                  <div className="bg-white p-6 rounded-2xl text-center shadow-2xl max-w-[280px] border-4 border-[#C8A27A]">
                    <div className="text-5xl mb-3 animate-bounce">
                      {wonPrize.type === 'retry' ? '😢' : '🎁'}
                    </div>
                    <h3 className="text-xl font-bold text-[#2D1B12] mb-2">
                      {wonPrize.type === 'retry' ? 'Şansına Küser!' : 'Tebrikler!'}
                    </h3>
                    <p className="text-sm text-[#8B5E3C] mb-4 font-medium">
                      {wonPrize.message}
                    </p>
                    
                    {wonPrize.code && (
                      <div className="bg-[#FAF8F5] p-3 rounded-xl border-2 border-dashed border-[#8B5E3C] mb-4">
                        <p className="text-xs text-[#8B5E3C] mb-1">Kupon Kodun:</p>
                        <span className="font-mono text-lg font-black text-[#2D1B12] tracking-wider">
                          {wonPrize.code}
                        </span>
                      </div>
                    )}

                    <Button onClick={() => onOpenChange(false)} className="w-full bg-[#8B5E3C] hover:bg-[#2D1B12] text-white">
                      Teşekkürler
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}