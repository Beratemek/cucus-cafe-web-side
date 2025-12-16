const passwordResetEmail = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Şifre Sıfırlama - CuCu's Coffee</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header with Coffee Theme -->
              <tr>
                <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #8B5E3C 0%, #C8A27A 100%); border-radius: 10px 10px 0 0;">
                  <div style="font-size: 48px; margin-bottom: 10px;">☕</div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">CuCu's Coffee & Cake</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Premium Coffee Experience</p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #2D1B12; font-size: 24px;">Şifre Sıfırlama İsteği</h2>
                  
                  ${userName ? `<p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">Merhaba <strong>${userName}</strong>,</p>` : ''}
                  
                  <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                    Hesabınız için şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:
                  </p>

                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #8B5E3C 0%, #C8A27A 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(139, 94, 60, 0.3);">
                          Şifremi Sıfırla
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0; color: #666; font-size: 14px; line-height: 1.6;">
                    Veya aşağıdaki linki tarayıcınıza kopyalayın:
                  </p>
                  
                  <div style="padding: 15px; background-color: #f8f8f8; border-radius: 5px; word-break: break-all; font-size: 13px; color: #666; margin-bottom: 20px;">
                    ${resetUrl}
                  </div>

                  <!-- Warning Box -->
                  <div style="padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                      ⏱️ <strong>Önemli:</strong> Bu link 10 dakika geçerlidir.
                    </p>
                  </div>

                  <p style="margin: 20px 0 0 0; color: #999; font-size: 13px; line-height: 1.6;">
                    Eğer bu isteği siz yapmadıysanız, bu emaili görmezden gelebilirsiniz. Hesabınızda hiçbir değişiklik yapılmayacaktır.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px; text-align: center; background-color: #f8f8f8; border-radius: 0 0 10px 10px;">
                  <p style="margin: 0 0 10px 0; color: #999; font-size: 13px;">
                    Bu email <strong>CuCu's Coffee & Cake</strong> tarafından gönderilmiştir.
                  </p>
                  <p style="margin: 0; color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} CuCu's Coffee. Tüm hakları saklıdır.
                  </p>
                  <div style="margin-top: 15px;">
                    <a href="https://cucus.online" style="color: #8B5E3C; text-decoration: none; font-size: 12px; margin: 0 10px;">Web Sitesi</a>
                    <span style="color: #ddd;">|</span>
                    <a href="https://cucus.online/iletisim" style="color: #8B5E3C; text-decoration: none; font-size: 12px; margin: 0 10px;">İletişim</a>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

const emailVerificationEmail = (verificationUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0;">
      <title>Email Doğrulama - CuCu's Coffee</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <tr>
                <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #8B5E3C 0%, #C8A27A 100%); border-radius: 10px 10px 0 0;">
                  <div style="font-size: 48px; margin-bottom: 10px;">☕</div>
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">CuCu's Coffee & Cake</h1>
                  <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Hoş Geldiniz!</p>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #2D1B12; font-size: 24px;">Email Adresinizi Doğrulayın</h2>
                  
                  ${userName ? `<p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">Merhaba <strong>${userName}</strong>,</p>` : ''}
                  
                  <p style="margin: 0 0 20px 0; color: #666; font-size: 16px; line-height: 1.6;">
                    CuCu's Coffee ailesine hoş geldiniz! Hesabınızı aktifleştirmek için lütfen email adresinizi doğrulayın.
                  </p>

                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #8B5E3C 0%, #C8A27A 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(139, 94, 60, 0.3);">
                          Email'i Doğrula
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0; color: #666; font-size: 14px; line-height: 1.6;">
                    Veya aşağıdaki linki tarayıcınıza kopyalayın:
                  </p>
                  
                  <div style="padding: 15px; background-color: #f8f8f8; border-radius: 5px; word-break: break-all; font-size: 13px; color: #666;">
                    ${verificationUrl}
                  </div>
                </td>
              </tr>

              <tr>
                <td style="padding: 30px; text-align: center; background-color: #f8f8f8; border-radius: 0 0 10px 10px;">
                  <p style="margin: 0 0 10px 0; color: #999; font-size: 13px;">
                    Bu email <strong>CuCu's Coffee & Cake</strong> tarafından gönderilmiştir.
                  </p>
                  <p style="margin: 0; color: #999; font-size: 12px;">
                    © ${new Date().getFullYear()} CuCu's Coffee. Tüm hakları saklıdır.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

module.exports = {
  passwordResetEmail,
  emailVerificationEmail
};
