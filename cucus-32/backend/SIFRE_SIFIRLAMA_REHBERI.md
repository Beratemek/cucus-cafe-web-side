# 🔐 Şifre Sıfırlama Özelliği - Kurulum Rehberi

## ✅ Mevcut Durum
Şifre sıfırlama özelliği backend ve frontend tarafında **tamamen hazır**!

## 📋 Özellikler

### Backend (API)
- ✅ `POST /api/auth/forgot-password` - Şifre sıfırlama isteği
- ✅ `POST /api/auth/reset-password` - Şifre sıfırlama işlemi
- ✅ User model'de `resetPasswordToken` ve `resetPasswordExpires` alanları
- ✅ `nodemailer` ile email gönderimi
- ✅ Crypto ile güvenli token üretimi
- ✅ 10 dakikalık token geçerlilik süresi

### Frontend (HTML Sayfaları)
- ✅ `forgot-password.html` - Şık ve modern şifre sıfırlama isteği sayfası
- ✅ `reset-password.html` - Şifre güçlük göstergeli yeni şifre belirleme sayfası
- ✅ Glassmorphism tasarım
- ✅ Smooth animasyonlar
- ✅ Responsive tasarım
- ✅ Form validasyonu
- ✅ Password visibility toggle
- ✅ Real-time şifre gücü kontrolü

## 🚀 Local'de Test Etme

### 1. Email Ayarları (Gmail SMTP)

`.env` dosyanızı düzenleyin:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=http://localhost:4000
```

**⚠️ Önemli:** Gmail için **App Password** kullanmalısınız:

1. Google hesabınıza gidin: https://myaccount.google.com/
2. "Security" (Güvenlik) -> "2-Step Verification" (2 Adımlı Doğrulama) açık olmalı
3. "App passwords" (Uygulama şifreleri) oluşturun: https://myaccount.google.com/apppasswords
4. "Mail" seçeneğini seçin ve bir isim verin
5. Oluşturulan 16 haneli şifreyi `.env` dosyasındaki `EMAIL_PASS` değerine yapıştırın

### 2. Backend Başlatma

```bash
cd backend
npm run dev
```

Backend http://localhost:4000 adresinde çalışacak.

### 3. Sayfaları Test Etme

Tarayıcınızda aşağıdaki adresleri açın:

- **Şifremi Unuttum:** http://localhost:4000/forgot-password.html
- **Şifre Sıfırlama:** http://localhost:4000/reset-password.html?token=TEST_TOKEN

### 4. Akış Testi

#### Adım 1: Şifre Sıfırlama İsteği
1. `forgot-password.html` sayfasını açın
2. Kayıtlı bir kullanıcının email adresini girin
3. "Şifre Sıfırlama Bağlantısı Gönder" butonuna tıklayın
4. Email adresinizi kontrol edin

#### Adım 2: Email'den Gelen Link
1. Email'inizde şifre sıfırlama linkini bulun
2. Link şu formatta olacak: `https://cucus.online/reset-password.html?token=...`
3. Local test için linki manuel olarak `http://localhost:4000/reset-password.html?token=...` şeklinde değiştirin

#### Adım 3: Yeni Şifre Belirleme
1. Reset linkine tıklayın
2. Yeni şifrenizi girin (en az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam)
3. Şifre gücü göstergesini kontrol edin
4. Şifreyi tekrar girin
5. "Şifremi Sıfırla" butonuna tıklayın
6. Başarılı mesajından sonra giriş sayfasına yönlendirileceksiniz

## 🌐 Production Deployment (Render.com)

### Environment Variables Ayarları

Render.com dashboard'unuzda aşağıdaki environment variable'ları ekleyin:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=4000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=https://cucus.online
```

### Static Files

`public` klasörü backend ile birlikte deploy edilecek ve Express otomatik olarak serve edecek.

## 📂 Dosya Yapısı

```
cucus-32/backend/
├── public/
│   ├── forgot-password.html    # Şifremi unuttum sayfası
│   └── reset-password.html     # Şifre sıfırlama sayfası
├── controllers/
│   └── authController.js       # forgotPassword & resetPassword fonksiyonları
├── models/
│   └── user.js                 # resetPasswordToken & resetPasswordExpires alanları
├── routes/
│   └── authRoutes.js           # /forgot-password & /reset-password route'ları
├── utils/
│   └── emailService.js         # Nodemailer email gönderim servisi
├── .env                        # Environment variables (gitignore'da)
├── .env.example                # .env şablonu
└── index.js                    # Express static files middleware
```

## 🔒 Güvenlik

- ✅ Token'lar SHA256 ile hashlenmiş olarak MongoDB'de saklanır
- ✅ Token'lar 10 dakika sonra otomatik olarak expire olur
- ✅ Kullanılan token'lar veritabanından silinir
- ✅ Email şifreleri ortam değişkenlerinde saklanır (koda yazılmaz)
- ✅ HTTPS üzerinden email linkleri gönderilir

## 🎨 Sayfaların Özellikleri

### forgot-password.html
- Modern gradient background
- Glassmorphism card tasarımı
- Email format validasyonu
- Loading spinner
- Success/Error mesajları
- Auto-hide success mesajı (10 saniye)

### reset-password.html
- Real-time şifre gücü göstergesi
- Görsel gereksinim kontrolü (✓/○)
- Password visibility toggle (👁️/🙈)
- Zayıf/Orta/Güçlü şifre renklendirmesi
- Form validasyonu
- Başarılı sıfırlama sonrası otomatik yönlendirme

## 🧪 Test Senaryoları

### ✅ Başarılı Akış
1. Kayıtlı email ile istek at
2. Email'i kontrol et
3. Link'e tıkla
4. Geçerli şifre gir
5. Şifre başarıyla güncellenir

### ❌ Hata Senaryoları
- Geçersiz email adresi
- Kayıtlı olmayan email
- Expired token (10 dakika geçmiş)
- Zayıf şifre (< 8 karakter)
- Eşleşmeyen şifreler
- Network hatası

## 📧 Email Şablonu

Email'ler HTML formatında gönderilir:
- Başlık: "Şifre Sıfırlama - CuCu's Coffee"
- İçerik: Şık HTML şablon
- Link: Tıklanabilir reset linki
- Geçerlilik: 10 dakika uyarısı

## 🎯 Sonraki Adımlar

Özellik tamamen hazır! Yapmanız gerekenler:

1. ✅ `.env` dosyasını düzenleyin (EMAIL_USER & EMAIL_PASS)
2. ✅ Gmail App Password oluşturun
3. ✅ Local'de test edin (`npm run dev`)
4. ✅ Production'a deploy edin
5. ✅ Production'da test edin (https://cucus.online/forgot-password.html)

## 💡 İpuçları

- **Local Test:** `CLIENT_URL=http://localhost:4000` kullanın
- **Production:** `CLIENT_URL=https://cucus.online` kullanın
- **Email Test:** Önce kendinize test emaili gönderin
- **Token Kontrolü:** MongoDB'de token'ların doğru kaydedildiğini kontrol edin
- **Email Spam:** Gmail ayarlarından "Less secure app access" kapalı olmalı (App Password kullanın)

## 🐛 Troubleshooting

### Email Gönderilmiyor
- Gmail App Password doğru mu?
- 2-Step Verification açık mı?
- `EMAIL_USER` ve `EMAIL_PASS` doğru mu?
- Internet bağlantısı var mı?

### Token Geçersiz
- Token süresi dolmuş olabilir (10 dakika)
- Link yanlış kopyalanmış olabilir
- MongoDB bağlantısı kontrol edin

### Sayfa Açılmıyor
- `express.static('public')` middleware eklenmiş mi?
- `public` klasörü doğru yerde mi?
- Backend çalışıyor mu?

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Backend console loglarını kontrol edin
2. Browser console'u kontrol edin
3. Network tab'ında API isteklerini kontrol edin
4. MongoDB'de user collection'ını kontrol edin
