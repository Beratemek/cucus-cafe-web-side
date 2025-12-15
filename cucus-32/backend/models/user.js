const mongoose = require("mongoose");

// ----- Loyalty History Schema -----
const loyaltyHistorySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["earn", "spend"], required: true }, // earn=puan kazanma, spend=puan harcama
    description: { type: String }
});

// ----- Coupon Schema -----
const couponSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discountType: { type: String, enum: ["percent", "amount"], required: true },
    discountValue: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
    earnedFrom: { type: String, default: "wheel" }, // wheel, campaign, etc.
    createdAt: { type: Date, default: Date.now }
});

// ----- Wheel Spin History Schema -----
const wheelSpinSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    reward: { type: String, required: true }, // "points", "coupon", "retry"
    rewardValue: { type: mongoose.Schema.Types.Mixed } // Number for points, Object for coupon
});

// ----- User Schema -----
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        surname: { type: String, required: true },

        email: { type: String, required: true, unique: true },

        passwordHash: { type: String, required: true },

        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer"
        },

        loyalty: {
            sadakat_no: { type: Number, unique: true },
            points: { type: Number, default: 0 },
            history: [loyaltyHistorySchema]
        },

        // Çarkı en son ne zaman çevirdi? (24 saat kontrolü için)
        lastWheelSpin: { type: Date },

        // Kazanılan Kuponlar Listesi
        coupons: [
          {
            code: { type: String, required: true }, // Örn: WHEEL10-XY9Z
            discountType: { type: String, enum: ["percent", "amount"], default: "percent" },
            discountValue: { type: Number, required: true }, // Örn: 10 (%10)
            expiryDate: { type: Date, required: true },
            isUsed: { type: Boolean, default: false }, // Kullanıldı mı?
            earnedFrom: { type: String, default: "wheel" } // Çarktan mı, admin mi verdi?
          }
       ],

        // Çark Geçmişi (Log tutmak istersen)
        wheelSpins: [
          {
            date: { type: Date, default: Date.now },
            reward: { type: String }, // "points", "coupon", "retry"
            rewardValue: { type: mongoose.Schema.Types.Mixed } // 10, 50 veya kupon objesi
         }
        ]  
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
