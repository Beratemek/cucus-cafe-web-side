import { Badge } from './ui/badge';
import { Clock, Percent, Gift, Calendar, Sparkles, Zap, Coffee } from 'lucide-react';
import { API_URL } from '../config';
// Eğer 'motion/react' hata vermeye devam ederse burayı 'framer-motion' olarak değiştirmeyi dene
import { motion } from 'motion/react'; 
import { useEffect, useState } from 'react';

// Backendden gelen veri tipi
interface CampaignData {
  _id: string;
  title: string;
  description: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  endDate: string;
  isActive: boolean;
}

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);

  // Sayfa yüklendiğinde verileri çek
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch(`${API_URL}/campaigns?active=true`);
      const data = await response.json();
      if (response.ok) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Kampanyalar yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  // Başlığa göre ikon seçen yardımcı fonksiyon
  const getIconForCampaign = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('doğum') || t.includes('hediye')) return Gift;
    if (t.includes('sabah') || t.includes('saat')) return Clock;
    if (t.includes('hafta') || t.includes('özel')) return Zap;
    if (t.includes('tatlı') || t.includes('ikram')) return Coffee;
    if (t.includes('yeni') || t.includes('ilk')) return Sparkles;
    return Percent; // Varsayılan ikon
  };

  // Tarihi formatla
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-50">
      {/* Hero */}
      <div className="bg-white py-16 sm:py-20 border-b border-[#E6D3BA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm text-[#8B5E3C] tracking-widest uppercase mb-4 block">Exclusive Offers</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#2D1B12] mb-4 tracking-tight">Kampanyalar</h1>
          <p className="text-lg text-[#8B5E3C] max-w-2xl mx-auto">
            Size özel fırsatlardan yararlanın
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        
        {loading ? (
          <div className="text-center text-[#8B5E3C]">Yükleniyor...</div>
        ) : campaigns.length === 0 ? (
           <div className="text-center text-[#8B5E3C]">Aktif kampanya bulunamadı.</div>
        ) : (
          /* Kampanyalar */
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl text-[#2D1B12] mb-2 tracking-tight">Aktif Kampanyalar</h2>
            </div>

            <div className="max-w-md mx-auto sm:max-w-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {campaigns.map((campaign, index) => {
                // HATA 1 ÇÖZÜMÜ: icon property'si yoktu, fonksiyonu çağırdık.
                const Icon = getIconForCampaign(campaign.title);
                
                return (
                  <motion.div
                    // HATA 2 ÇÖZÜMÜ: id yerine _id kullandık
                    key={campaign._id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="relative group overflow-hidden bg-white border border-[#E6D3BA] hover:border-[#C8A27A] hover:shadow-2xl transition-all duration-300 rounded-3xl"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-full"></div>
                    <div className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl text-[#2D1B12] mb-3 font-bold">{campaign.title}</h3>
                          <Badge className="bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] text-white border-0 rounded-full shadow-md">
                            {/* HATA 3 ÇÖZÜMÜ: discount yerine discountType ve Value kullandık */}
                            {campaign.discountType === 'percent' ? `%${campaign.discountValue}` : `₺${campaign.discountValue}`} İndirim
                          </Badge>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl">
                          <Icon className="w-6 h-6 text-[#8B5E3C]" />
                        </div>
                      </div>
                      
                      <p className="text-[#8B5E3C] mb-6 leading-relaxed text-sm min-h-[60px]">
                        {campaign.description || "Kampanya detayları için mağazamıza bekleriz."}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-[#C8A27A]">
                        <Calendar className="w-4 h-4 text-[#8B5E3C]" />
                        {/* HATA 4 ÇÖZÜMÜ: validUntil yerine endDate ve format fonksiyonunu kullandık */}
                        <span>Son Tarih: {formatDate(campaign.endDate)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Kampanya Kuralları */}
        <div className="bg-white border border-[#E6D3BA] p-8 rounded-3xl shadow-sm">
          <h2 className="text-2xl text-[#2D1B12] mb-6">Kampanya Kuralları</h2>
          <ul className="space-y-3 text-[#8B5E3C]">
            <li className="flex gap-3">
              <span className="text-[#8B5E3C] flex-shrink-0">•</span>
              <span>Kampanyalar birbirleriyle birleştirilemez.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#8B5E3C] flex-shrink-0">•</span>
              <span>Kampanyaları kullanmak için kasiyere bildirmeyi unutmayın.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#8B5E3C] flex-shrink-0">•</span>
              <span>Her kampanya belirtilen geçerlilik tarihleri içinde kullanılabilir.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[#8B5E3C] flex-shrink-0">•</span>
              <span>Kampanyalardan yararlanmak için üye kaydınız gerekmektedir.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}