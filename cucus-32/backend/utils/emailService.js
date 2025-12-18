const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Environment variables kontrolü
    const requiredVars = ['EMAIL_USER', 'EMAIL_PASS'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ EMAIL CONFIGURATION ERROR:');
      requiredVars.forEach(varName => {
        console.error(`   ${varName}:`, process.env[varName] ? '✓ Set' : '✗ NOT SET');
      });
      throw new Error(`Email configuration missing: ${missingVars.join(', ')}`);
    }
    
    console.log('📧 Email Service: Attempting to send email...');
    console.log('📧 To:', options.email);
    console.log('📧 Subject:', options.subject);
    console.log('📧 Using EMAIL_USER:', process.env.EMAIL_USER);
    console.log('📧 EMAIL_PASS configured:', process.env.EMAIL_PASS ? 'Yes ✓' : 'No ✗');

    // Gmail için optimize edilmiş yapılandırma
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // Canlı sunucuda (Render) sertifika hatası almamak için
        rejectUnauthorized: false
      },
      debug: true,
      logger: true
    });

    // Verify transporter
    await transporter.verify();
    console.log('📧 SMTP connection verified ✓');

    const mailOptions = {
      from: `"CuCu's Coffee & Cake - Destek" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully! ✓');
    console.log('📧 Message ID:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('❌ Email Service Error:', error.message);
    console.error('❌ Full error:', error);
    throw error;
  }
};

module.exports = sendEmail;

