const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ["percent", "amount"], // Yüzde veya Sabit Tutar
      default: "percent",
    },
    discountValue: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    image: { type: String }, // Kampanya görseli için opsiyonel alan
    couponCode: {
      type: String,
      unique: true,
      sparse: true // Allows null/undefined values while maintaining uniqueness
    },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Kampanya kodunu kullanan kullanıcılar
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
