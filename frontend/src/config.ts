// Production'da otomatik backend URL belirleme
const host = window.location.hostname;

// Demo sürümü (GitHub Pages): backend yok, menü statik veriden gelir, hesap özellikleri kapalı
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || host.endsWith('github.io');
export const DEMO_NOTICE = "Bu, sitenin demo sürümü. Üyelik, fırsat çarkı ve yönetim paneli bu sürümde kapalı; menüyü ve sayfaları gezebilirsiniz.";

const isProduction = DEMO_MODE || host === 'cucus.online' || host.includes('vercel.app');
const BACKEND_URL = isProduction ? 'https://cafe-web-site.onrender.com' : 'http://localhost:4000';

export const API_URL = import.meta.env.VITE_API_URL || `${BACKEND_URL}/api`;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || BACKEND_URL;
