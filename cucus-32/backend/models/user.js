const mongoose = require("mongoose");

// ----- Loyalty History Schema -----
const loyaltyHistorySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["earn", "spend"], required: true },
    description: { type: String }
});

// ----- Coupon Schema -----
const couponSchema = new mongoose.Schema({
    code: { type: String, required: true },
    discountType: { type: String, enum: ["percent", "amount"], required: true },
    discountValue: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
    earnedFrom: { type: String, default: "wheel" },
    validCategories: { type: [String], default: null },
    validSizes: { type: [String], default: null },
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

        lastWheelSpin: { type: Date },

        coupons: [
            {
                code: { type: String, required: true },
                discountType: { type: String, enum: ["percent", "amount"], default: "percent" },
                discountValue: { type: Number, required: true }, // Örn: 10 (%10)
                expiryDate: { type: Date, required: true },
                isUsed: { type: Boolean, default: false },
                earnedFrom: { type: String, default: "wheel" },
                validCategories: { type: [String], default: null },
                validSizes: { type: [String], default: null }
            }
        ],

        // Spin History
        wheelSpins: [
            {
                date: { type: Date, default: Date.now },
                reward: { type: String },
                rewardValue: { type: mongoose.Schema.Types.Mixed }
            }
        ],

        // Email Verification
        isVerified: { type: Boolean, default: false },
        verificationToken: { type: String },
        verificationTokenExpires: { type: Date },

        // Password Reset
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
