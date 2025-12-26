import { Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import logoImage from '../assets/logo.png';

interface NavigationProps {
  currentPage: 'home' | 'menu' | 'campaigns' | 'profile' | 'contact';
  onNavigate: (page: 'home' | 'menu' | 'campaigns' | 'profile' | 'contact') => void;
  onAdminClick: () => void;
  isAdmin?: boolean;
}

export function Navigation({
  currentPage,
  onNavigate,
  onAdminClick,
  isAdmin = false,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, label: 'Ana Sayfa' },
    { id: 'menu' as const, label: 'Menü' },
    { id: 'campaigns' as const, label: 'Kampanyalar' },
    { id: 'contact' as const, label: 'Konum' },
    { id: 'profile' as const, label: 'Hesabım' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-[#E6D3BA] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-md ring-2 ring-[#E6D3BA] group-hover:ring-[#C8A27A] transition-all">
              <img
                src={logoImage}
                alt="CuCu's Coffee & Cake"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xl text-[#2D1B12] font-medium">
                CuCu's Coffee & Cake
              </span>
              <div className="text-[10px] text-[#8B5E3C] tracking-widest uppercase font-semibold">
                Sweet Moments
              </div>
            </div>
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const isProfile = item.id === 'profile';

              // 1. ADIM: TEMEL SINIFLAR (HEPSİ İÇİN AYNI BOYUT: px-4 py-2)
              let buttonClasses = "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ";

              // 2. ADIM: RENK VE GÖRÜNÜM AYARLARI
              if (isProfile) {
                // DURUM 1: HESABIM (Yeşil ve Dolu)
                buttonClasses += "text-white bg-[#5D7553] hover:bg-[#4A5D42] shadow-md";
              } else if (isActive) {
                // DURUM 2: DİĞERLERİ AKTİF (Kahverengi ve Dolu)
                buttonClasses += "text-white bg-[#8B5E3C] shadow-sm";
              } else {
                // DURUM 3: DİĞERLERİ PASİF (Şeffaf)
                buttonClasses += "text-[#8B5E3C] hover:text-[#2D1B12] hover:bg-[#F5EFE6]";
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={buttonClasses}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Admin Butonu */}
            {isAdmin && (
              <button
                onClick={onAdminClick}
                className="ml-2 p-2 text-[#8B5E3C] hover:text-[#2D1B12] hover:bg-[#F5EFE6] rounded-full transition-all duration-200"
                title="Yönetici Girişi"
              >
                <Shield className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#2D1B12] hover:bg-[#F5EFE6] rounded-full transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE MENU LIST */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E6D3BA] bg-white/95">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const isProfile = item.id === 'profile';

              // MOBİL İÇİN DE AYNI MANTIK
              let mobileClasses = "block w-full text-left py-3 px-4 text-base font-medium rounded-xl mb-1 transition-all ";

              if (isProfile) {
                mobileClasses += "text-white bg-[#5D7553] shadow-md";
              } else if (isActive) {
                mobileClasses += "text-white bg-[#8B5E3C]";
              } else {
                mobileClasses += "text-[#8B5E3C] hover:text-[#2D1B12] hover:bg-[#F5EFE6]";
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={mobileClasses}
                >
                  {item.label}
                </button>
              );
            })}

            {isAdmin && (
              <button
                onClick={() => {
                  onAdminClick();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 py-3 px-4 text-[#8B5E3C] hover:text-[#2D1B12] hover:bg-[#F5EFE6] rounded-xl mt-2 border-t border-[#E6D3BA]"
              >
                <Shield className="w-5 h-5" />
                Yönetici Girişi
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
