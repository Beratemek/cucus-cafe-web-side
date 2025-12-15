const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
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
    });

    // Verify transporter
    await transporter.verify();
    console.log('📧 SMTP connection verified ✓');

    const mailOptions = {
      from: `CuCu's Coffee & Cake <${process.env.EMAIL_USER}>`,
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

