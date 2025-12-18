const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function setAdminRole() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB bağlantısı başarılı');

    const User = require('../models/user');
    
    const adminEmail = 'busraozkok@hotmail.com';
    
    const user = await User.findOne({ email: adminEmail });
    
    if (!user) {
      console.log('❌ Kullanıcı bulunamadı:', adminEmail);
      process.exit(1);
    }
    
    console.log('📋 Mevcut kullanıcı bilgileri:');
    console.log('Email:', user.email);
    console.log('İsim:', user.name, user.surname);
    console.log('Mevcut Role:', user.role);
    
    // Admin rolü ata
    user.role = 'admin';
    await user.save();
    
    console.log('✅ Kullanıcı admin olarak güncellendi!');
    console.log('Yeni Role:', user.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

setAdminRole();
