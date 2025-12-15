import { Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import logoImage from '../assets/logo.png';

interface NavigationProps {
  currentPage: 'home' | 'menu' | 'campaigns' | 'profile' | 'contact';
  onNavigate: (page: 'home' | 'menu' | 'campaigns' | 'profile' | 'contact') => void;
  onAdminClick: () => void;
}

export function Navigation({ currentPage, onNavigate, onAdminClick }: NavigationProps) {
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
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white shadow-md ring-2 ring-[#E6D3BA] group-hover:ring-[#C8A27A] transition-all">
                <img src={logoImage} alt="CuCu's Coffee & Cake" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <span className="text-xl text-[#2D1B12]">CuCu's Coffee & Cake</span>
              <div className="text-[10px] text-[#8B5E3C] tracking-widest uppercase">Sweet Moments</div>
            </div>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 text-sm transition-all duration-200 rounded-full ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C]'
                      : 'text-[#8B5E3C] hover:text-[#2D1B12] hover:bg-[#E6D3BA]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            {/* Admin Link */}
            <button
              onClick={onAdminClick}
              className="ml-2 p-2 text-[#8B5E3C] hover:text-[#2D1B12] hover:bg-[#E6D3BA] rounded-full transition-all duration-200 group"
              title="Yönetici Girişi"
            >
              <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#2D1B12] hover:bg-[#E6D3BA] rounded-full transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E6D3BA]">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left py-3 px-4 text-base transition-colors rounded-xl mb-1 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-[#8B5E3C] to-[#8B5E3C]'
                      : 'text-[#8B5E3C] hover:text-[#2D1B12] hover:bg-[#E6D3BA]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            {/* Admin Link - Mobile */}
            <button
              onClick={() => {
                onAdminClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-3 px-4 text-base text-[#8B5E3C] hover:text-[#2D1B12] hover:bg-[#E6D3BA] transition-colors rounded-xl mt-2 border-t border-[#E6D3BA] pt-4 w-full"
            >
              <Shield className="w-5 h-5" />
              Yönetici Girişi
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
