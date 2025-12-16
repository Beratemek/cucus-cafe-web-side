# 🌐 Port Yapılandırma Rehberi

## 📊 Kullanılan Portlar

### **Port 3000** - Frontend (Vite/React)
- **Konum:** `frontend/`
- **Başlatma:** `npm run dev`
- **URL:** http://localhost:3000
- **Açıklama:** Ana web uygulaması arayüzü (React + TypeScript)
- **Kullanım:** Kullanıcıların web sitesini görüntülediği yer

### **Port 4000** - Backend (Express/Node.js)
- **Konum:** `cucus-32/backend/`
- **Başlatma:** `npm run dev`
- **URL:** http://localhost:4000
- **Açıklama:** API sunucusu + Static HTML sayfaları
- **Kullanım:** 
  - API endpoints: `/api/auth/*`, `/api/products/*`, vb.
  - Static sayfalar: `/forgot-password.html`, `/reset-password.html`

### **Port 5173** - Kullanılmıyor
- Vite'ın varsayılan portu
- Frontend package.json'da port 3000 olarak yapılandırılmış
- Bu port referansları eski ve kullanılmıyor

## 🔧 Neden Farklı Portlar?

### Frontend (3000) ve Backend (4000) Ayrımı:
1. **Geliştirme Kolaylığı:** Frontend ve backend bağımsız çalışır
2. **CORS Yönetimi:** Cross-origin istekleri kontrollü şekilde yapılır
3. **Hot Reload:** Frontend değişikliklerinde sadece frontend yenilenir
4. **Deployment:** Production'da farklı sunucularda barındırılabilir

## 🚀 Nasıl Çalıştırılır?

### Aynı Anda Her İkisi (Önerilen):

**Terminal 1 - Backend:**
```bash
cd cucus-32/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Tek Port Kullanmak İsterseniz:

Backend'i frontend build dosyalarını serve edecek şekilde yapılandırabilirsiniz:
1. Frontend'i build edin: `npm run build`
2. Build dosyalarını backend'in public klasörüne kopyalayın
3. Sadece backend'i çalıştırın (Port 4000)

## 🌍 Production (cucus.online)

Production'da:
- **Frontend:** Vercel veya Render'da host edilir
- **Backend:** Render.com'da host edilir
- **Domain:** cucus.online → Frontend'e yönlendirilir
- **API:** cucus-backend.onrender.com → Backend'e yönlendirilir

## 📝 Environment Variables

### Backend (.env)
```env
PORT=4000
MONGO_URI=mongodb+srv://...
MONGODB_URI=mongodb+srv://...   # alternatif
JWT_SECRET=your_secret_key
EMAIL_USER=your@email.com
EMAIL_PASS=your_app_password
CLIENT_URL=https://cucus.online  # production
# CLIENT_URL=http://localhost:3000  # local development
```

### Frontend
Frontend environment variables genelde build sırasında kullanılır.
Vite projelerinde `.env` dosyasında:
```env
VITE_API_URL=http://localhost:4000  # local
# VITE_API_URL=https://cucus-backend.onrender.com  # production
```

## 🔍 Port Çakışması Durumunda

Eğer portlar kullanımdaysa:

**Frontend port değiştirmek için:**
```bash
# Terminal'de
npm run dev -- --port 3001
```

**Backend port değiştirmek için:**
- `.env` dosyasında `PORT=4001` yapın
- Veya: `PORT=4001 npm run dev`

## ⚠️ .gitignore ve .env

**.env dosyası artık Git'te takip ediliyor!**

⚠️ **UYARI:** Hassas bilgileri (şifreler, API keyleri) .env dosyasına yazmadan önce düşünün!

Eğer .env'i tekrar gitignore'a eklemek isterseniz:
1. `.gitignore` dosyasını açın
2. `# .env (commented out - .env is now tracked)` satırını `.env` yapın
3. `git rm --cached backend/.env` komutu çalıştırın

## 🧪 Test Etme

**Backend test:**
```bash
curl http://localhost:4000
# Beklenen: "Ciao! CuCus Backend Service is Running ☕🍰"
```

**Frontend test:**
- Tarayıcıda: http://localhost:3000

**Şifre sıfırlama sayfaları test:**
- http://localhost:4000/forgot-password.html
- http://localhost:4000/reset-password.html

## 📞 Sorun Giderme

### "Port already in use" hatası:
```bash
# Windows'ta portu kullanan process'i bul
netstat -ano | findstr :4000
# Process'i öldür (PID ile)
taskkill /PID <PID> /F
```

### Backend başlamıyor:
1. MongoDB bağlantısını kontrol edin (.env)
2. `node_modules` silip `npm install` yapın
3. Terminal çıktısında hata mesajlarını okuyun

### Frontend backend'e bağlanamıyor:
1. Backend çalışıyor mu kontrol edin: `curl http://localhost:4000`
2. CORS ayarlarını kontrol edin (backend `cors()` middleware)
3. Frontend'de API URL'ini kontrol edin
