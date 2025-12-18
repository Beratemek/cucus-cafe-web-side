# Email Yapılandırması - Brevo API (HTTP)

Bu doküman, backend projesinde Brevo API ile email servisinin nasıl yapılandırılacağını açıklar.

**Neden SMTP Değil?** Render gibi cloud platformlarda SMTP protokolü timeout hataları verebilir. Bu nedenle HTTP tabanlı Brevo API kullanıyoruz.

## 📧 Gerekli Environment Değişkenleri

`.env` dosyanıza aşağıdaki değişkenleri ekleyin:

```env
# Email Configuration (Brevo API - HTTP)
EMAIL_USER=your-brevo-verified-sender-email
EMAIL_PASS=your-brevo-api-key

# Client URL (Frontend)
CLIENT_URL=https://your-domain.com
```

**Önemli Notlar:**
- **EMAIL_USER**: Brevo'da doğrulanmış sender email adresi (örn: emekberat19@gmail.com)
- **EMAIL_PASS**: Brevo API Key (SMTP Key değil, API Key!)
- **Protokol**: HTTP/HTTPS (SMTP değil)
- **Timeout yok**: REST API kullanıldığı için Render'da sorunsuz çalışır

## 🔧 Yapılandırma Detayları

### Brevo API Key Nasıl Alınır?

1. Brevo hesabınıza giriş yapın: https://app.brevo.com/
2. Sağ üst köşeden **Settings** (Ayarlar) → **SMTP & API** sekmesine gidin
3. **API Keys** bölümünde **Create a new API key** butonuna tıklayın
4. Key'e bir isim verin (örn: "CuCu's Backend API")
5. **Version**: v3 seçin
6. Oluşturulan API Key'i kopyalayın ve `EMAIL_PASS` olarak kullanın

**Önemli:** 
- API Key sadece bir kez gösterilir, mutlaka kaydedin!
- SMTP Key değil, **API Key** kullanmalısınız
- EMAIL_USER olarak Brevo'da doğrulanmış bir sender email kullanın

### Brevo'da Sender Email Doğrulama

1. Brevo Dashboard → **Senders** → **Add a new sender**
2. Email adresinizi ekleyin (örn: emekberat19@gmail.com)
3. Doğrulama emailini kontrol edin ve linke tıklayın
4. Doğrulandıktan sonra bu email'i `EMAIL_USER` olarak kullanabilirsiniz

### Teknik Detaylar

**API Endpoint:**
```
POST https://api.brevo.com/v3/smtp/email
```

**Request Headers:**
```json
{
  "accept": "application/json",
  "api-key": "your-brevo-api-key",
  "content-type": "application/json"
}
```

**Request Body:**
```json
{
  "sender": {
    "email": "sender@example.com",
    "name": "Cucu's Coffee"
  },
  "to": [{"email": "recipient@example.com"}],
  "subject": "Email Subject",
  "htmlContent": "<html>...</html>"
}
```

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
EMAIL_USER=your-brevo-verified-sender-email
EMAIL_PASS=your-brevo-api-key
CLIENT_URL=https://your-frontend-domain.com
```

**Önemli:** 
- HTTP API kullanıldığı için SMTP timeout sorunu yaşanmaz
- EMAIL_PASS olarak API Key (SMTP Key değil) kullanın
- EMAIL_USER Brevo'da doğrulanmış sender email olmalı

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

1. **Brevo Günlük Limit**: Ücretsiz plan günde 300 email gönderebilir
2. **API Key**: SMTP Key değil, API Key kullanın
3. **Sender Doğrulama**: EMAIL_USER Brevo'da doğrulanmış olmalı
4. **CLIENT_URL**: Production'da mutlaka gerçek domain'inizi kullanın
5. **Güvenlik**: `.env` dosyasını asla Git'e commit etmeyin (`.gitignore`'da olmalı)
6. **HTTP API**: SMTP timeout sorunu yaşanmaz, Render'da sorunsuz çalışır

## 🔍 Hata Ayıklama

Email gönderiminde sorun yaşarsanız:

1. **Console logları kontrol edin**: Detaylı hata mesajları ve Brevo API yanıtları görüntülenir
2. **API Key'i kontrol edin**: Doğru API Key kullanıyor musunuz?
3. **Sender email doğrulandı mı**: Brevo'da sender email doğrulanmış olmalı
4. **Environment değişkenlerini kontrol edin**: EMAIL_USER ve EMAIL_PASS doğru mu?

## 📚 İlgili Dosyalar

- `utils/emailService.js` - Email gönderim servisi
- `utils/emailTemplates.js` - Email HTML şablonları
- `controllers/authController.js` - Email gönderimi kullanılan controller
- `.env.example` - Environment değişkenleri şablonu
