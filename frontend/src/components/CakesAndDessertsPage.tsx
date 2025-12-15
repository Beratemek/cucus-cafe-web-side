import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { ArrowLeft, Cake } from 'lucide-react';
import { useEffect } from 'react';

// 1. Veri tipini tanımlıyoruz
interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  image: string;
  popular: boolean;
  category: string;
}

// 2. Sayfa "items" prop'unu kabul ediyor
interface CakesAndDessertsPageProps {
  onBack: () => void;
  items: Product[]; 
}

export function CakesAndDessertsPage({ onBack, items }: CakesAndDessertsPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6D3BA] to-[#C8A27A]">
      {/* Header with Back Button */}
      <div className="bg-[#2D1B12] py-8 sm:py-12 border-b-4 border-[#8B5E3C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#E6D3BA] hover:text-[#C8A27A] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Menüye Dön</span>
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Cake className="w-10 h-10 sm:w-12 sm:h-12 text-[#C8A27A]" strokeWidth={1.5} />
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#E6D3BA] tracking-tight">Cakes & Desserts</h1>
            </div>
            <p className="text-lg text-[#C8A27A] max-w-2xl mx-auto">
              El yapımı pastalar ve özel tatlılarımız
            </p>
          </div>
        </div>
      </div>

      {/* Desserts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* DÜZELTİLEN KISIM BURASI: desserts.map yerine items.map yaptık */}
          {items.map((dessert, index) => (
            <motion.div
              key={dessert.id} // Key olarak ID kullandık
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <ImageWithFallback
                  src={dessert.image}
                  alt={dessert.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                {dessert.popular && (
                  <div className="absolute top-4 right-4 bg-[#8B5E3C] text-white px-4 py-2 rounded-full text-sm shadow-lg">
                    Popüler
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-[#2D1B12] mb-2 tracking-tight font-bold">{dessert.name}</h3>
                {dessert.description && (
                  <p className="text-[#8B5E3C] text-sm mb-4 line-clamp-2 font-bold">{dessert.description}</p>
                )}
                <div className="mt-4 pt-4 border-t border-[#E6D3BA]">
                  <span className="text-[#8B5E3C] font-bold">{dessert.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}