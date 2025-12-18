const axios = require('axios');

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
    
    console.log('📧 Email Service (Brevo API): Attempting to send email...');
    console.log('📧 To:', options.email);
    console.log('📧 Subject:', options.subject);
    console.log('📧 Using EMAIL_USER:', process.env.EMAIL_USER);
    console.log('📧 EMAIL_PASS (API Key) configured:', process.env.EMAIL_PASS ? 'Yes ✓' : 'No ✗');

    // Brevo API v3 ile email gönderimi
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          email: process.env.EMAIL_USER,
          name: "Cucu's Coffee"
        },
        to: [
          {
            email: options.email,
            name: options.name || 'Değerli Müşterimiz'
          }
        ],
        subject: options.subject,
        htmlContent: options.html
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.EMAIL_PASS,
          'content-type': 'application/json'
        }
      }
    );

    console.log('📧 Email sent successfully via Brevo API! ✓');
    console.log('📧 Message ID:', response.data.messageId);
    
    return response.data;
  } catch (error) {
    console.error('❌ Email Service Error:', error.message);
    
    if (error.response) {
      console.error('❌ Brevo API Error Response:');
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Full error:', error);
    }
    
    throw error;
  }
};

module.exports = sendEmail;
