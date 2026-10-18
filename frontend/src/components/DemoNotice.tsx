import { Info } from 'lucide-react';
import { DEMO_MODE, DEMO_NOTICE } from '../config';

// Demo sürümünde hesap gerektiren alanların üstünde gösterilen kısa not
export function DemoNotice({ tone = 'light', className = '', message = DEMO_NOTICE }: { tone?: 'light' | 'dark'; className?: string; message?: string }) {
  if (!DEMO_MODE) return null;

  const colors = tone === 'dark'
    ? 'bg-white/10 border-white/20 text-[#E6D3BA]'
    : 'bg-[#FAF8F5] border-[#E6D3BA] text-[#8B5E3C]';

  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border text-sm leading-relaxed ${colors} ${className}`}>
      <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p>{message}</p>
    </div>
  );
}
