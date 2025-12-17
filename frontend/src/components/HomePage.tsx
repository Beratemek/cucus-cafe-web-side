import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Coffee, Award, Clock, Star, ArrowRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { WheelOfFortune } from './WheelOfFortune';
import { MiniWheel } from './MiniWheel';
import { getFeaturedProducts } from '../data/products';

interface HomePageProps {
  onNavigate?: (page: 'home' | 'menu' | 'campaigns' | 'profile' | 'contact') => void;
  onNavigateToRegister?: () => void;
}

export function HomePage({ onNavigate, onNavigateToRegister }: HomePageProps) {
  const heroImages = [
    'https://images.unsplash.com/photo-1611653683150-cb048456cc4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwaW50ZXJpb3IlMjBtb2Rlcm58ZW58MXx8fHwxNzYwNDc5NzQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBtaW5pbWFsfGVufDF8fHx8MTc2MDUyNTM2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1501959915551-4e8d30928317?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwd29ya3NwYWNlJTIwYWVzdGhldGljfGVufDF8fHx8MTc2MDUyNTM2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBicmV3aW5nJTIwcG91cnxlbnwxfHx8fDE3NjA1MjUzNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  // Sayfa yüklendiğinde scroll'u en üste al
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Featured Cakes & Desserts - Production Ready
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoadingProducts(true);
      try {
        // TODO: Backend hazır olduğunda bu satırı aktif edin:
        // const response = await fetch('/api/products?featured=true');
        // const data = await response.json();
        // setFeaturedProducts(data);
        
        // Featured Cakes & Desserts Menu
        const featuredDesserts = await getFeaturedProducts();
        
        // API çağrısını simüle et (0.5 saniye gecikme)
        setTimeout(() => {
          setFeaturedProducts(featuredDesserts);
          setIsLoadingProducts(false);
        }, 500);
      } catch (error) {
        console.error('Öne çıkan ürünler yüklenirken hata:', error);
        setIsLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const features = [
    {
      icon: Coffee,
      title: 'Özel Kahveler',
      description: 'Her fincan özenle hazırlanır',
    },
    {
      icon: Award,
      title: 'Ödüllü Lezzetler',
      description: 'Şef yapımı tatlılar',
    },
    {
      icon: Clock,
      title: 'Her Gün Taze',
      description: 'Taze çekilmiş kahve garantisi',
    },
    {
      icon: Heart,
      title: 'Sıcak Atmosfer',
      description: 'Kendinizi evinizde hissedin',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-50">
      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <ImageWithFallback
              src={heroImages[currentImageIndex]}
              alt="Cafe"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2D1B12]/85 via-[#2D1B12]/60 to-transparent"></div>
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="inline-block mb-4 px-5 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                <span className="text-sm bg-gradient-to-r from-[#8B5E3C] to-[#2D1B12] bg-clip-text text-transparent tracking-wide">Premium Coffee & Cake</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white mb-6 tracking-tight leading-tight">
                Her An<br />
                Bir <span className="text-[#E6D3BA]">Tatlı Anı</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
                Ustalıkla seçilmiş kahveler ve el yapımı tatlılar. CuCu's'ta her fincan, her dilim özel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => onNavigate?.('menu')}
                  className="bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] hover:from-[#2D1B12] hover:to-[#2D1B12] text-white border-0 px-8 shadow-lg shadow-[#2D1B12]/30 rounded-full"
                >
                  Menüyü İncele
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  size="lg" 
                  onClick={() => onNavigate?.('campaigns')}
                  className="bg-white/90 hover:bg-white text-[#2D1B12] border-0 px-8 shadow-lg rounded-full"
                >
                  Kampanyalar
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-gradient-to-r from-[#C8A27A] to-[#8B5E3C] w-8'
                  : 'bg-white/50 w-1.5 hover:bg-white/75'
              }`}
              aria-label={`Görsel ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm text-[#8B5E3C] tracking-widest uppercase mb-4 block">Neden CuCu's?</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2D1B12] mb-4 tracking-tight">Fark Yaratan Detaylar</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 bg-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 border border-[#E6D3BA] hover:border-[#C8A27A] hover:shadow-xl transition-all duration-300 rounded-3xl text-center"
                >
                  <div className="inline-flex p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4 transition-colors">
                    <Icon className="w-7 h-7 text-[#8B5E3C]" />
                  </div>
                  <h3 className="text-[#2D1B12] mb-2">{feature.title}</h3>
                  <p className="text-[#8B5E3C] text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-6">
            <div>
              <span className="text-sm text-[#8B5E3C] tracking-widest uppercase mb-2 block">Menü</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2D1B12] tracking-tight">Öne Çıkanlar</h2>
            </div>
            <Button 
              variant="outline" 
              className="border-[#C8A27A] text-[#8B5E3C] hover:bg-[#E6D3BA] hover:border-[#8B5E3C] rounded-full"
              onClick={() => onNavigate?.('menu')}
            >
              Tüm Menü
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          
          {isLoadingProducts ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#E6D3BA] border-t-[#8B5E3C] rounded-full animate-spin"></div>
                <p className="text-[#8B5E3C]">Ürünler yükleniyor...</p>
              </div>
            </div>
          ) : (
            <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide">
              <div className="flex gap-8 lg:gap-10 pb-4">
                {featuredProducts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group flex flex-col overflow-hidden bg-white border border-[#E6D3BA] hover:border-[#C8A27A] hover:shadow-2xl transition-all duration-300 rounded-3xl flex-shrink-0 w-[280px] sm:w-[320px]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      {item.tag && (
                        <div className="absolute top-4 right-4">
                          <span className="px-4 py-1.5 bg-white/95 backdrop-blur-sm text-[#8B5E3C] text-xs tracking-wide border border-[#E6D3BA] rounded-full shadow-sm">
                            {item.tag}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-7">
                      <h3 className="text-[#2D1B12] mb-3">{item.name}</h3>
                      <p className="text-sm text-[#8B5E3C] mb-4 leading-relaxed">{item.description}</p>
                      <div className="mt-auto">
                        <p className="text-sm bg-gradient-to-r from-[#8B5E3C] to-[#2D1B12] bg-clip-text text-transparent">{item.price}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-[#8B5E3C] fill-[#8B5E3C]" />
              <span className="text-sm text-[#8B5E3C] tracking-widest uppercase">Exclusive</span>
              <Star className="w-5 h-5 text-[#8B5E3C] fill-[#8B5E3C]" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2D1B12] mb-6 tracking-tight">
              Özel Ayrıcalıklara Sahip Olun
            </h2>
            <p className="text-lg text-[#8B5E3C] mb-8 max-w-2xl mx-auto">
              Üye olun ve birçok özel kampanyalarımızdan haberdar olun
            </p>
            <Button size="lg" className="bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C] hover:from-[#2D1B12] hover:to-[#2D1B12] text-white border-0 px-8 shadow-lg shadow-[#2D1B12]/30 rounded-full" onClick={onNavigateToRegister}>
              Hemen Üye Ol
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Floating Wheel of Fortune Button */}
      <motion.button
        onClick={() => setIsWheelOpen(true)}
        className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-[#C8A27A] via-[#8B5E3C] to-[#2D1B12] hover:from-[#2D1B12] hover:to-[#8B5E3C] rounded-full shadow-2xl hover:shadow-[#C8A27A]/60 z-50 flex items-center justify-center group transition-all duration-300 p-2 border-4 border-white"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full h-full">
          <MiniWheel />
        </div>
      </motion.button>

      {/* Wheel of Fortune Dialog */}
      <WheelOfFortune isOpen={isWheelOpen} onOpenChange={setIsWheelOpen} />
    </div>
  );
}