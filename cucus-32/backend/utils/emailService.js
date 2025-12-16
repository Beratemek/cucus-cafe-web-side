const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Environment variables kontrolü
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ EMAIL CONFIGURATION ERROR:');
      console.error('   EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ NOT SET');
      console.error('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Set' : '✗ NOT SET');
      throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASS environment variables.');
    }

    console.log('📧 Email Service: Attempting to send email...');
    console.log('📧 To:', options.email);
    console.log('📧 Subject:', options.subject);
    console.log('📧 Using EMAIL_USER:', process.env.EMAIL_USER);
    console.log('📧 EMAIL_PASS configured:', process.env.EMAIL_PASS ? 'Yes ✓' : 'No ✗');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 30000, // 30 saniye
      socketTimeout: 30000, // 30 saniye
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

