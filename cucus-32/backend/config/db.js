const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MONGO_URI veya MONGODB_URI kullan (hangisi varsa)
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI not found in environment variables (MONGO_URI or MONGODB_URI)');
    }

    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000, // 30 saniye timeout
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB Başarıyla Bağlandı!");
  } catch (error) {
    console.error("❌ MongoDB Bağlantı Hatası:");
    console.error("   Hata:", error.message);
    console.error("   Detay:", error.name);
    throw error;
  }
};

module.exports = connectDB;
