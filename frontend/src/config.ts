// Production'da otomatik backend URL belirleme
const isProduction = window.location.hostname === 'cucus.online' || window.location.hostname.includes('vercel.app');
const BACKEND_URL = isProduction ? 'https://cucus-backend.onrender.com' : 'http://localhost:4000';

export const API_URL = import.meta.env.VITE_API_URL || `${BACKEND_URL}/api`;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || BACKEND_URL;
