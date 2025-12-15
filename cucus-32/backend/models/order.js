const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Siparişi veren Müşteri (Sadakat Numarasından bulunup buraya ID'si yazılacak)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // İşlemi yapan Kasiyer/Admin
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    // Sepetteki Ürünler
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: { type: Number, default: 1 }, // Adet
        // --- BURASI EKLENDİ ---
        selectedSize: { type: String, required: true }, // Örn: "Küçük Boy"
        price: { type: Number, required: true } // O anki satış fiyatı (Zam gelirse etkilenmemesi için)
      }
    ],

    // Mali Bilgiler
    totalAmount: { type: Number, required: true },  // Toplam Tutar
    pointsEarned: { type: Number, default: 0 },     // Bu siparişten kazanılan puan
    pointsUsed: { type: Number, default: 0 },       // Kullanılan puan (varsa)

    // Kupon Bilgileri
    couponCode: { type: String },                   // Kullanılan kupon kodu
    discountAmount: { type: Number, default: 0 },   // Kupon indirimi tutarı

    // Durum
    status: {
      type: String,
      enum: ["Tamamlandı", "İptal Edildi"],
      default: "Tamamlandı" // Kasa işlemi olduğu için direkt tamamlandı sayıyoruz
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);