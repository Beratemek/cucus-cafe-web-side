# Production Deployment Checklist

## 1. Render.com Backend Environment Variables

Backend servisinizde aşağıdaki environment variables tanımlı olmalı:

```
MONGO_URI=mongodb+srv://nisanur:emekberat@cucus.wwbwoc.mongodb.net/cucus-cafe
JWT_SECRET=your_production_jwt_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=https://cucus.online
PORT=4000
```

## 2. Frontend API URL

Frontend'de API istekleri doğru backend URL'ine gitmeli:
- Production: `https://cucus-backend.onrender.com`

## 3. Deployment Adımları

### Backend (Render.com):
1. Render Dashboard → Backend Service seçin
2. "Manual Deploy" → "Deploy latest commit" tıklayın
3. Logs'u kontrol edin (hata var mı?)

### Frontend (Vercel veya Render):
1. Frontend dashboard'a gidin
2. Latest deployment'ı kontrol edin
3. Gerekirse redeploy edin

## 4. Test URL'leri

**Canlı Test:**
- Forgot Password: https://cucus.online/hesap (veya /forgot-password)
- Backend API: https://cucus-backend.onrender.com/api/auth/forgot-password

**Backend Health Check:**
```bash
curl https://cucus-backend.onrender.com/
```

Cevap: "Ciao! CuCus Backend Service is Running ☕🍰" gelmelidir.

## 5. Yaygın Sorunlar ve Çözümleri

### Sorun 1: "404 Not Found"
**Çözüm:** Backend'de static files middleware eksik olabilir.
- `index.js` dosyasında `app.use(express.static('public'))` var mı kontrol edin

### Sorun 2: "Email gönderilemedi"
**Çözüm:** Render.com'da EMAIL_USER ve EMAIL_PASS environment variables tanımlı değil.
- Dashboard → Environment → Add env variables

### Sorun 3: "Sunucu Hatası"
**Çözüm:** MongoDB bağlantısı yok veya hatalı.
- Render logs'u kontrol edin: Dashboard → Logs
- MONGO_URI doğru mu kontrol edin

### Sorun 4: Frontend backend'e bağlanamıyor
**Çözüm:** CORS hatası olabilir.
- Backend `index.js` dosyasında CORS yapılandırması var mı?
- Frontend'de API URL doğru mu?

## 6. Hızlı Kontrol Komutları

```bash
# Backend health check
curl https://cucus-backend.onrender.com/

# Test forgot password endpoint
curl -X POST https://cucus-backend.onrender.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'

# MongoDB connection check (Render logs'dan bakın)
# "✅ MongoDB Başarıyla Bağlandı!" mesajını arayın
```

## 7. Frontend HTML Sayfaları

Eğer forgot-password.html backend'den serve ediliyorsa:
- URL: https://cucus-backend.onrender.com/forgot-password.html

Eğer frontend'den serve ediliyorsa:
- URL: https://cucus.online/forgot-password (veya .html)

## 8. Immediate Action Items

1. ✅ GitHub'a push edildi (commit: 58fa726)
2. ⏳ Render.com otomatik deploy bekliyor (3-5 dakika)
3. ❓ Environment variables kontrol et
4. ❓ Deployment logs kontrol et

---

**Next Steps:**
1. Render.com dashboard'a git
2. Latest deployment'ı bekle
3. Logs'u incele
4. Test et: https://cucus-backend.onrender.com/forgot-password.html
