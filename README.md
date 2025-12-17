# CuCu's Coffee & Cake Web Application

Modern ve premium bir kafe web sitesi projesi. Admin paneli, ürün yönetimi, kampanya yönetimi ve Fırsat Çarkı gibi özellikler içerir.

## 🚀 Proje Yapısı

Bu proje iki ana klasörden oluşur:

*   **`frontend`**: React, Vite, Tailwind CSS ve Radix UI ile geliştirilmiş kullanıcı arayüzü.
*   **`cucus-32/backend`**: Node.js, Express ve MongoDB kullanan sunucu tarafı uygulaması.

## 🛠️ Kurulum ve Çalıştırma (Lokal)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

### 1. Gereksinimler
*   Node.js (v18 veya üzeri önerilir)
*   MongoDB (Lokal veya Atlas URI)

### 2. Backend Kurulumu
Backend klasörüne gidin ve bağımlılıkları yükleyin:

```bash
cd cucus-32/backend
npm install
```

`.env` dosyasını oluşturun ve gerekli değişkenleri ekleyin (Örnek):
```env
MONGO_URI=mongodb+srv://<kullanici>:<sifre>@cluster.mongodb.net/cucus
JWT_SECRET=password123
PORT=4000
```

Sunucuyu başlatın:
```bash
npm run dev
# veya
node index.js
```
*Backend varsayılan olarak `http://localhost:4000` adresinde çalışır.*

### 3. Frontend Kurulumu
Yeni bir terminal açın ve frontend klasörüne gidin:

```bash
cd frontend
npm install
```

Frontend uygulamasını başlatın:
```bash
npm run dev
```

## 🌍 Yayına Alma (Deployment)

Projenizi web'de yayınlamak için aşağıdaki servisleri öneriyoruz.

### Frontend (Vercel veya Netlify)
Frontend klasörünü Vercel veya Netlify gibi statik site sağlayıcılarına bağlayabilirsiniz.

**Vercel Ayarları:**
*   **Root Directory**: `frontend`
*   **Framework Preset**: Vite
*   **Build Command**: `vite build` (veya `npm run build`)
*   **Output Directory**: `dist`
*   **Environment Variables**:
    *   `VITE_API_URL`: Backend sunucunuzun canlı adresi (örn: `https://cucus-backend.onrender.com/api`)
    *   `VITE_API_BASE_URL`: Backend ana adresi (örn: `https://cucus-backend.onrender.com`)

### Backend (Render, Railway veya Fly.io)
Backend klasörünü (`cucus-32/backend`) bir Node.js servisi olarak dağıtın.

**Render.com Ayarları:**
*   **Root Directory**: `cucus-32/backend`
*   **Build Command**: `npm install`
*   **Start Command**: `node index.js`
*   **Environment Variables**: `.env` dosyanızdaki değerleri (MONGO_URI, JWT_SECRET) buraya ekleyin.

## 📋 Özellikler

*   **Premium Arayüz**: Modern ve kullanıcı dostu tasarım.
*   **Fırsat Çarkı**: Müşteriler için günlük ödül ve indirim sistemi.
*   **Admin Paneli**: 
    *   Ürün/Menü Yönetimi
    *   Sipariş Takibi
    *   Kampanya Oluşturma
    *   Müşteri Görüntüleme
*   **Kullanıcı Sistemi**: Kayıt, Giriş, Şifre Sıfırlama ve Profil Yönetimi.

## 🛡️ Lisans
Bu proje özel kullanım içindir.
