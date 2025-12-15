const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sizes: [
      {
        size: { type: String }, 
        price: { type: Number }
      }
    ],
    
    category: { type: String, required: true },
    description: { type: String },
    // YENİ EKLENEN KISIM:
    image: { type: String, default: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600" },

    // YENİ EKLENEN: Popüler ürün mü?
    isPopular: { type: Boolean, default: false },

    // Ürünü kim oluşturdu: (admin)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
