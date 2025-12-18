# Email Yapılandırması - Nodemailer (Brevo SMTP)

Bu doküman, backend projesinde Nodemailer email servisinin Brevo SMTP ile nasıl yapılandırılacağını açıklar.

## 📧 Gerekli Environment Değişkenleri

`.env` dosyanıza aşağıdaki değişkenleri ekleyin:

```env
# Email Configuration (Nodemailer - Brevo SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-brevo-login-email
EMAIL_PASS=your-brevo-smtp-key

# Client URL (Frontend)
CLIENT_URL=https://your-domain.com
```

**Önemli Notlar:**
- **EMAIL_USER**: Brevo hesabınıza giriş yaptığınız email adresi
- **EMAIL_PASS**: Brevo SMTP Key (API Key değil!)
- **FROM Adresi**: Kodda `emekberat19@gmail.com` kullanılıyor (Brevo'da doğrulanmış sender adresi)
- Port 587 için `secure: false` (STARTTLS) kullanılır

## 🔧 Yapılandırma Detayları

### Brevo SMTP Key Nasıl Alınır?

1. Brevo hesabınıza giriş yapın: https://app.brevo.com/
2. Sağ üst köşeden **Settings** (Ayarlar) → **SMTP & API** sekmesine gidin
3. **SMTP** bölümünde **Create a new SMTP key** butonuna tıklayın
4. Key'e bir isim verin (örn: "CuCu's Backend")
5. Oluşturulan SMTP Key'i kopyalayın ve `EMAIL_PASS` olarak kullanın
6. **EMAIL_USER** olarak Brevo'ya giriş yaptığınız email adresini kullanın

**Önemli:** 
- SMTP Key sadece bir kez gösterilir, mutlaka kaydedin!
- API Key ile SMTP Key farklıdır, SMTP Key kullanmalısınız
- FROM adresi olarak Brevo'da doğrulanmış bir sender adresi kullanmalısınız

### Port Yapılandırması

**Port 587 (STARTTLS - Brevo için önerilen):**
```env
EMAIL_PORT=587
```
- `secure: false` kullanılır
- STARTTLS ile güvenli bağlantı
- Cloud platformlar için ideal

### Diğer Email Sağlayıcıları

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=465
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

**SendGrid:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=465
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## 🚀 Render (Production) Ayarları

Render'da environment variables eklerken:

1. Render Dashboard → Your Service → **Environment** sekmesi
2. Aşağıdaki değişkenleri ekleyin:

```
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your-brevo-login-email
EMAIL_PASS=your-brevo-smtp-key
CLIENT_URL=https://your-frontend-domain.com
```

**Önemli:** FROM adresi kodda sabit olarak `emekberat19@gmail.com` kullanılıyor. Bu adresin Brevo hesabınızda doğrulanmış olduğundan emin olun.

### TLS Sertifika Hatası Önleme

Kodda zaten `rejectUnauthorized: false` ayarı mevcut. Bu, Render gibi cloud platformlarda sertifika doğrulama hatalarını önler.

## 📝 Email Şablonları

Email içeriği `utils/emailTemplates.js` dosyasında tanımlıdır:

- **Password Reset Email**: Şifre sıfırlama maili
- **Email Verification Email**: Email doğrulama maili

Her iki şablon da `CLIENT_URL` kullanarak yönlendirme linkleri oluşturur.

## 🧪 Test Etme

Email servisini test etmek için:

```javascript
// Test email gönderimi
const sendEmail = require('./utils/emailService');

await sendEmail({
  email: 'test@example.com',
  subject: 'Test Email',
  html: '<h1>Test</h1><p>Bu bir test emailidir.</p>'
});
```

## ⚠️ Önemli Notlar

1. **Gmail Günlük Limit**: Gmail ücretsiz hesaplar günde 500 email gönderebilir
2. **App Password**: Normal şifrenizi değil, App Password kullanın
3. **2FA Zorunlu**: Gmail App Password için 2 Adımlı Doğrulama aktif olmalı
4. **CLIENT_URL**: Production'da mutlaka gerçek domain'inizi kullanın
5. **Güvenlik**: `.env` dosyasını asla Git'e commit etmeyin (`.gitignore`'da olmalı)

## 🔍 Hata Ayıklama

Email gönderiminde sorun yaşarsanız:

1. **Console logları kontrol edin**: Detaylı hata mesajları görüntülenir
2. **SMTP bağlantısını test edin**: `transporter.verify()` otomatik çalışır
3. **Environment değişkenlerini kontrol edin**: Tüm değişkenler doğru mu?
4. **Gmail güvenlik ayarları**: "Daha az güvenli uygulamalar" kapalı olmalı, App Password kullanın

## 📚 İlgili Dosyalar

- `utils/emailService.js` - Email gönderim servisi
- `utils/emailTemplates.js` - Email HTML şablonları
- `controllers/authController.js` - Email gönderimi kullanılan controller
- `.env.example` - Environment değişkenleri şablonu
