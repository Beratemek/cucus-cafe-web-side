import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { Coffee, Cake, Sparkles, Flame, Snowflake, Wine, IceCream, UtensilsCrossed, Apple, GlassWater } from 'lucide-react';
import { useState, useEffect } from 'react';

import { API_URL } from '../config';
// Sayfa Importları
import { CakesAndDessertsPage } from './CakesAndDessertsPage';
import { StandardCoffeesPage } from './StandardCoffeesPage';
import { SpecialCoffeesPage } from './SpecialCoffeesPage';
import { HotBeveragesPage } from './HotBeveragesPage';
import { IcedCoffeesPage } from './IcedCoffeesPage';
import { FrappePage } from './FrappePage';
import { MilkshakePage } from './MilkshakePage';
import { FrozenPage } from './FrozenPage';
import { SmoothiePage } from './SmoothiePage';
import { ColdDrinksPage } from './ColdDrinksPage';
import { SandwichPage } from './SandwichPage';
import { CocktailPage } from './CocktailPage';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  image: string;
  popular: boolean;
  category: string; 
}

export function MenuPage() {
  const [activePage, setActivePage] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProducts = async () => {
      try {
        // DÜZELTME: Senin backend kodunda port 4000 olduğu için burayı 4000 yaptım.
        const response = await fetch(`${API_URL}/products`); 
        const data = await response.json();
        
        const rawList = data.products || []; 

        // --- VERİ DÖNÜŞTÜRME (MAPPING) ---
        const formattedList: Product[] = rawList.map((item: any) => {
          
          let finalPrice = "Fiyat Yok";

          // Eğer ürünün boyutları (sizes) varsa hepsini birleştirip yazıyoruz
          if (item.sizes && Array.isArray(item.sizes) && item.sizes.length > 0) {
            // Örnek Çıktı: "Küçük: 100₺ | Büyük: 150₺"
            finalPrice = item.sizes
              .map((s: any) => `${s.size}: ${s.price}₺`)
              .join(" | ");
          }

          return {
            id: item._id, 
            name: item.name,
            description: item.description || "", 
            price: finalPrice, 
            image: item.image,
            popular: item.isPopular || false, 
            category: item.category
          };
        });

        setProducts(formattedList);
        setLoading(false);
      } catch (error) {
        console.error("Veri çekilemedi:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- KATEGORİ FİLTRELEME ---
  const cakesData = products.filter(p => p.category === 'cakes');
  const standardCoffeesData = products.filter(p => p.category === 'standard-coffee');
  const specialCoffeesData = products.filter(p => p.category === 'special-coffee');
  const hotDrinksData = products.filter(p => p.category === 'hot-beverages');
  const coldCoffeesData = products.filter(p => p.category === 'iced-coffees');
  const frappeData = products.filter(p => p.category === 'frappe');
  const frozenData = products.filter(p => p.category === 'frozen');
  const milkshakeData = products.filter(p => p.category === 'milkshake');
  const smoothiesData = products.filter(p => p.category === 'smoothie');
  const coldDrinksData = products.filter(p => p.category === 'cold-drinks');
  const sandwichesData = products.filter(p => p.category === 'sandwich');
  const cocktailsData = products.filter(p => p.category === 'cocktail');

  // --- SAYFA YÖNLENDİRMELERİ ---
  if (activePage === 'cakes') return <CakesAndDessertsPage onBack={() => setActivePage(null)} items={cakesData} />;
  if (activePage === 'standardCoffees') return <StandardCoffeesPage onBack={() => setActivePage(null)} items={standardCoffeesData} />;
  if (activePage === 'specialCoffees') return <SpecialCoffeesPage onBack={() => setActivePage(null)} items={specialCoffeesData} />;
  if (activePage === 'hotDrinks') return <HotBeveragesPage onBack={() => setActivePage(null)} items={hotDrinksData} />;
  if (activePage === 'coldCoffees') return <IcedCoffeesPage onBack={() => setActivePage(null)} items={coldCoffeesData} />;
  if (activePage === 'frappe') return <FrappePage onBack={() => setActivePage(null)} items={frappeData} />;
  if (activePage === 'frozen') return <FrozenPage onBack={() => setActivePage(null)} items={frozenData} />;
  if (activePage === 'milkshake') return <MilkshakePage onBack={() => setActivePage(null)} items={milkshakeData} />;
  if (activePage === 'smoothies') return <SmoothiePage onBack={() => setActivePage(null)} items={smoothiesData} />;
  if (activePage === 'coldDrinks') return <ColdDrinksPage onBack={() => setActivePage(null)} items={coldDrinksData} />;
  if (activePage === 'sandwiches') return <SandwichPage onBack={() => setActivePage(null)} items={sandwichesData} />;
  if (activePage === 'cocktails') return <CocktailPage onBack={() => setActivePage(null)} items={cocktailsData} />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl text-[#8B5E3C] font-bold animate-pulse">Menü Yükleniyor...</div>
      </div>
    );
  }

  // --- KATEGORİ KARTLARI ---
  const categories = [
    { id: 'standardCoffees', name: 'Standard Coffees', icon: Coffee, image: 'https://images.unsplash.com/photo-1672570050756-4f1953bde478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzY0NDgzMDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'cakes', name: 'Cakes & Desserts', icon: Cake, image: 'https://images.unsplash.com/photo-1751125134100-29b16243f196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NjQ1NjIyMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'specialCoffees', name: 'Special Coffees', icon: Sparkles, image: 'https://images.unsplash.com/photo-1680381724318-c8ac9fe3a484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMGFydCUyMHNwZWNpYWx0eXxlbnwxfHx8fDE3NjQ1OTU2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'hotDrinks', name: 'Hot Beverages', icon: Flame, image: 'https://images.unsplash.com/photo-1592919210782-91f4f6f721a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3QlMjBjaG9jb2xhdGUlMjBzdGVhbXxlbnwxfHx8fDE3NjQ1OTU2Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'coldCoffees', name: 'Iced Coffees', icon: Snowflake, image: 'https://images.unsplash.com/photo-1601816993296-a2d1ce3e001f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VkJTIwY29mZmVlJTIwZ2xhc3N8ZW58MXx8fHwxNzY0NTk1Njc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'frappe', name: 'Frappe', icon: IceCream, image: 'https://images.unsplash.com/photo-1630994210310-3b7c6d1bab48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmFwcGUlMjB3aGlwcGVkJTIwY3JlYW18ZW58MXx8fHwxNzY0NTk1Njc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'frozen', name: 'Frozen', icon: Snowflake, image: 'https://images.unsplash.com/photo-1625694946129-b0c20b287375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcm96ZW4lMjBkcmluayUyMGljZXxlbnwxfHx8fDE3NjQ1OTU2Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'milkshake', name: 'Milkshake', icon: IceCream, image: 'https://images.unsplash.com/photo-1701275966376-9da452f0e7f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrc2hha2UlMjBzdHJhd2JlcnJ5fGVufDF8fHx8MTc2NDU1OTE4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'smoothies', name: 'Smoothies', icon: Apple, image: 'https://images.unsplash.com/photo-1610450620997-6921021865da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbW9vdGhpZSUyMGJvd2wlMjBiZXJyaWVzfGVufDF8fHx8MTc2NDU5NTY3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'coldDrinks', name: 'Cold Drinks', icon: GlassWater, image: 'https://images.unsplash.com/photo-1609639643505-3c158a56de42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW1vbmFkZSUyMGZyZXNoJTIwY2l0cnVzfGVufDF8fHx8MTc2NDU5NTY4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'sandwiches', name: 'Sandwiches', icon: UtensilsCrossed, image: 'https://images.unsplash.com/photo-1763647814142-b1eb054d42f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGRlbGklMjBnb3VybWV0fGVufDF8fHx8MTc2NDU5NTY4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
    { id: 'cocktails', name: 'Cocktails', icon: Wine, image: 'https://images.unsplash.com/photo-1646821198838-c0b050b1e896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMG1vaml0byUyMHRyb3BpY2FsfGVufDF8fHx8MTc2NDU5NTY4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-50">
      <div className="bg-white py-16 sm:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm text-slate-600 tracking-widest uppercase mb-4 block">Menu</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-4 tracking-tight">Lezzetlerimiz</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ustalıkla hazırlanmış kahveler ve el yapımı lezzetler
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="space-y-6 sm:space-y-8 mb-16">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true }}
                onClick={() => setActivePage(category.id)}
                className="relative w-full h-48 sm:h-56 lg:h-64 rounded-[32px] overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer block"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60"></div>
                </div>

                <div className="relative h-full flex flex-col items-center justify-center text-white z-10 pointer-events-none">
                  <Icon className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mb-4 drop-shadow-2xl" strokeWidth={1.5} />
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl drop-shadow-2xl tracking-tight">{category.name}</h2>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}