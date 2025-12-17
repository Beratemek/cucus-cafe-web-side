const User = require("../models/user");

// Çark ödül havuzu ve şans oranları
const wheelPrizes = [
    // Düşük puanlar (%30)
    { type: "points", value: 10, weight: 15 },
    { type: "points", value: 25, weight: 15 },

    // Orta puan (%25)
    { type: "points", value: 50, weight: 25 },

    // Yüksek puan (%15)
    { type: "points", value: 100, weight: 15 },

    // Çok yüksek puan (%5)
    { type: "points", value: 250, weight: 5 },

    // İndirim kuponları (%12)
    { type: "coupon", value: 5, weight: 6 },
    { type: "coupon", value: 10, weight: 6 },

    // Yüksek indirim (%5)
    { type: "coupon", value: 15, weight: 3 },
    { type: "coupon", value: 20, weight: 2 },

    // Tekrar Dene (%8)
    { type: "retry", value: 0, weight: 8 }
];

// Ağırlıklı rastgele seçim fonksiyonu
function getRandomPrize() {
    const totalWeight = wheelPrizes.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;

    for (const prize of wheelPrizes) {
        random -= prize.weight;
        if (random <= 0) {
            return prize;
        }
    }

    return wheelPrizes[0]; // Fallback
}

// Kupon kodu oluşturma (6 karakter - kısa ve akılda kalıcı)
function generateCouponCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Çark çevirme
exports.spinWheel = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
        }

        // Günlük limit kontrolü kaldırıldı
        const now = new Date();
        // Ödül seç
        const prize = getRandomPrize();
        let rewardData = {};

        if (prize.type === "points") {
            // Puan ekle
            user.loyalty.points += prize.value;
            user.loyalty.history.push({
                amount: prize.value,
                type: "earn",
                description: `Çarktan ${prize.value} puan kazanıldı`
            });

            rewardData = {
                type: "points",
                value: prize.value,
                message: `Tebrikler! ${prize.value} sadakat puanı kazandınız!`
            };

        } else if (prize.type === "coupon") {
            // Kupon oluştur
            const couponCode = generateCouponCode();
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30); // 30 gün geçerli

            user.coupons.push({
                code: couponCode,
                discountType: "percent",
                discountValue: prize.value,
                expiryDate,
                isUsed: false,
                earnedFrom: "wheel"
            });

            rewardData = {
                type: "coupon",
                value: prize.value,
                code: couponCode,
                expiryDate,
                message: `Tebrikler! %${prize.value} indirim kuponu kazandınız!`
            };

        } else if (prize.type === "retry") {
            rewardData = {
                type: "retry",
                value: 0,
                message: "Maalesef bu sefer şansınız yaver gitmedi. Yarın tekrar deneyin!"
            };
        }

        // Çark geçmişine ekle
        user.wheelSpins.push({
            reward: prize.type,
            rewardValue: prize.type === "coupon" ? { code: rewardData.code, value: prize.value } : prize.value
        });

        // Son çark çevirme tarihini güncelle
        user.lastWheelSpin = now;

        await user.save();

        return res.status(200).json({
            success: true,
            reward: rewardData
        });

    } catch (error) {
        console.error("Spin Wheel Error:", error);
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// Kullanıcının kuponlarını listeleme
exports.getUserCoupons = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
        }

        // Sadece kullanılmamış ve süresi dolmamış kuponları filtrele
        const validCoupons = user.coupons.filter(coupon =>
            !coupon.isUsed && new Date(coupon.expiryDate) > new Date()
        );

        return res.status(200).json({
            count: validCoupons.length,
            coupons: validCoupons
        });

    } catch (error) {
        console.error("Get Coupons Error:", error);
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// Çark geçmişini görüntüleme
exports.getWheelHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
        }

        return res.status(200).json({
            count: user.wheelSpins.length,
            history: user.wheelSpins,
            lastSpin: user.lastWheelSpin
        });

    } catch (error) {
        console.error("Get Wheel History Error:", error);
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// Kupon kullanma
exports.useCoupon = async (req, res) => {
    try {
        const userId = req.user.id;
        const { code } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
        }

        // Kuponu bul
        const coupon = user.coupons.find(c => c.code === code && !c.isUsed);

        if (!coupon) {
            return res.status(404).json({ message: "Kupon bulunamadı veya zaten kullanılmış!" });
        }

        // Süre kontrolü
        if (new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ message: "Kuponun süresi dolmuş!" });
        }

        // Kuponu kullanılmış olarak işaretle
        coupon.isUsed = true;
        await user.save();

        return res.status(200).json({
            message: "Kupon başarıyla kullanıldı!",
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            }
        });

    } catch (error) {
        console.error("Use Coupon Error:", error);
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

// Kupon doğrulama
exports.validateCoupon = async (req, res) => {
    try {
        const userId = req.user.id;
        const { code } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
        }

        // Kuponu bul
        const coupon = user.coupons.find(c => c.code === code);

        if (!coupon) {
            return res.status(404).json({
                valid: false,
                message: "Kupon bulunamadı!"
            });
        }

        // Kullanılmış mı?
        if (coupon.isUsed) {
            return res.status(400).json({
                valid: false,
                message: "Kupon zaten kullanılmış!"
            });
        }

        // Süresi dolmuş mu?
        if (new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({
                valid: false,
                message: "Kuponun süresi dolmuş!"
            });
        }

        return res.status(200).json({
            valid: true,
            message: "Kupon geçerli!",
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                expiryDate: coupon.expiryDate
            }
        });

    } catch (error) {
        console.error("Validate Coupon Error:", error);
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};
