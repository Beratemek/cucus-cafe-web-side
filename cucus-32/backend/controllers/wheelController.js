const User = require("../models/user");

const wheelPrizes = [
    { type: "points", value: 10, weight: 20 },
    { type: "points", value: 25, weight: 15 },
    { type: "points", value: 50, weight: 20 },
    { type: "points", value: 100, weight: 10 },
    { type: "coupon", value: 5, weight: 10 },
    { type: "coupon", value: 10, weight: 5 },
    { type: "coupon", value: 20, weight: 5 },
    { type: "retry", value: 0, weight: 15 }
];


function getRandomPrize() {
    const totalWeight = wheelPrizes.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;

    for (const prize of wheelPrizes) {
        random -= prize.weight;
        if (random <= 0) {
            return prize;
        }
    }

    return wheelPrizes[0];
}


function generateCouponCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

exports.spinWheel = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
        }

        const now = new Date();


        if (user.lastWheelSpin) {
            const lastSpin = new Date(user.lastWheelSpin);
            const diff = now - lastSpin; // Difference in milliseconds
            const oneDay = 24 * 60 * 60 * 1000;

            if (diff < oneDay) {
                const remainingTime = oneDay - diff;
                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

                return res.status(403).json({
                    message: `Günde sadece 1 kez çevirebilirsin. Kalan süre: ${hours} saat ${minutes} dakika.`
                });
            }
        }


        const prize = getRandomPrize();
        let rewardData = {};

        if (prize.type === "points") {
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

        user.wheelSpins.push({
            reward: prize.type,
            rewardValue: prize.type === "coupon" ? { code: rewardData.code, value: prize.value } : prize.value
        });


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

exports.getUserCoupons = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
        }


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


        if (new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({ message: "Kuponun süresi dolmuş!" });
        }

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


        if (coupon.isUsed) {
            return res.status(400).json({
                valid: false,
                message: "Kupon zaten kullanılmış!"
            });
        }


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

// Puanı kupona çevirme
exports.convertPointsToCoupon = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı!" });
        }

        if (user.loyalty.points < 500) {
            return res.status(400).json({ message: "Yetersiz puan! En az 500 puanınız olmalı." });
        }

        // Puan düş
        user.loyalty.points -= 500;
        user.loyalty.history.push({
            amount: 500,
            type: "spend",
            description: "500 puan ile ücretsiz kahve kuponu alındı"
        });

        // Kupon oluştur
        const couponCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // 30 gün geçerli

        const newCoupon = {
            code: couponCode,
            discountType: "percent",
            discountValue: 100, // %100 indirim
            expiryDate,
            isUsed: false,
            earnedFrom: "loyalty_conversion",
            validCategories: ["standard-coffee"], // Sadece Standart Kahveler
            validSizes: ["Küçük"] // Sadece Küçük boy
        };

        user.coupons.push(newCoupon);

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Tebrikler! 500 puan karşılığında ücretsiz kahve kuponunuz oluşturuldu.",
            coupon: newCoupon,
            remainingPoints: user.loyalty.points
        });

    } catch (error) {
        console.error("Convert Points Error:", error);
        return res.status(500).json({ message: "Sunucu hatası!" });
    }
};

