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

              // Temel Sınıflar (Boyutlandırma) - Hepsi Eşit: px-4 py-2
              // border-transparent ekledik ki diğerlerinde sınır olmasa bile boyut kaymasın.
              let buttonClasses = "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 border ";

              if (isActive) {
                // 1. DURUM: AKTİF (HEPSİ İÇİN GEÇERLİ)
                // İster profil olsun ister başka, aktifse içi dolu kahverengi.
                buttonClasses += "border-[#8B5E3C] bg-[#8B5E3C] text-white shadow-sm";
              } else if (isProfile) {
                // 2. DURUM: PROFİL PASİF (ÇERÇEVELİ)
                // Aktif değil ama Profil ise: İçi boş, Çerçevesi Kahverengi.
                // Hover olunca içi dolsun diye hover:bg ekledim, çok şık durur.
                buttonClasses += "border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white";
              } else {
                // 3. DURUM: DİĞERLERİ PASİF (STANDART)
                // Çerçeve şeffaf (border-transparent).
                buttonClasses += "border-transparent text-[#8B5E3C] hover:text-[#2D1B12] hover:bg-[#F5EFE6]";
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

              // MOBİL İÇİN AYNI MANTIK
              let mobileClasses = "block w-full text-left py-3 px-4 text-base font-medium rounded-xl mb-1 transition-all border ";

              if (isActive) {
                // Aktifse Dolu
                mobileClasses += "border-[#8B5E3C] bg-[#8B5E3C] text-white";
              } else if (isProfile) {
                 // Profil Pasifse Çerçeveli
                mobileClasses += "border-[#8B5E3C] text-[#8B5E3C]";
              } else {
                // Diğer Pasifler
                mobileClasses += "border-transparent text-[#8B5E3C] hover:text-[#2D1B12] hover:bg-[#F5EFE6]";
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
