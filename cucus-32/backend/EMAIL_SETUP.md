# Email Yapılandırması - Nodemailer

Bu doküman, backend projesinde Nodemailer email servisinin nasıl yapılandırılacağını açıklar.

## 📧 Gerekli Environment Değişkenleri

`.env` dosyanıza aşağıdaki değişkenleri ekleyin:

```env
# Email Configuration (Nodemailer)
# Gmail için sadece kullanıcı adı ve şifre gereklidir
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Client URL (Frontend)
CLIENT_URL=https://your-domain.com
```

**Not:** Nodemailer'ın `service: 'gmail'` parametresi kullanıldığı için `EMAIL_HOST` ve `EMAIL_PORT` ayarlarına gerek yoktur. Gmail SMTP ayarları otomatik olarak yapılandırılır.

## 🔧 Yapılandırma Detayları

### Port Seçenekleri

**Port 587 (STARTTLS - Önerilen):**
```env
EMAIL_PORT=587
```
- `secure: false` otomatik olarak ayarlanır
- STARTTLS ile güvenli bağlantı
- Daha yüksek uyumluluk (cloud platformlar için ideal)
- Gmail ve çoğu email sağlayıcı için önerilen

**Port 465 (SSL/TLS):**
```env
EMAIL_PORT=465
```
- `secure: true` otomatik olarak ayarlanır
- Doğrudan SSL/TLS bağlantısı
- Alternatif seçenek

### Gmail için App Password Oluşturma

1. Google Hesabınıza gidin: https://myaccount.google.com/
2. **Güvenlik** sekmesine tıklayın
3. **2 Adımlı Doğrulama**'yı aktif edin (zorunlu)
4. **Uygulama Şifreleri** (App Passwords) bölümüne gidin
5. Uygulama seçin: **Mail**
6. Cihaz seçin: **Diğer** (özel ad girin, örn: "CuCu's Backend")
7. Oluşturulan 16 haneli şifreyi `EMAIL_PASS` olarak kullanın

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
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
CLIENT_URL=https://your-frontend-domain.com
```

**Not:** `service: 'gmail'` kullanıldığı için `EMAIL_HOST` ve `EMAIL_PORT` eklemenize gerek yoktur.

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
