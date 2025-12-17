const mongoose = require('mongoose');
const User = require('../models/user');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const addTestCoupon = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Hedef kullanıcıyı bul (Admin)
        // Eğer kullanıcı email verirse burayı değiştireceğim
        // Şimdilik ilk bulduğu admin'e veya yoksa ilk kullanıcıya ekleyecek
        
        let user = await User.findOne({ email: 'emekberat20@gmail.com' });
        
        if (!user) {
            console.log('Admin user not found, trying to find any user...');
            user = await User.findOne();
        }

        if (!user) {
            console.log('No users found in database!');
            process.exit(1);
        }

        console.log(`Adding coupon to user: ${user.name} ${user.surname} (${user.email})`);

        const couponCode = "TEST10";
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // 30 gün geçerli

        // Kupon daha önce varsa sil (test için)
        user.coupons = user.coupons.filter(c => c.code !== couponCode);

        user.coupons.push({
            code: couponCode,
            discountType: "percent",
            discountValue: 10,
            expiryDate: expiryDate,
            isUsed: false,
            earnedFrom: "manual_test"
        });

        await user.save();
        
        console.log(`\n✅ Kupon Başarıyla Eklendi!`);
        console.log(`Kupon Kodu: ${couponCode}`);
        console.log(`İndirim: %10`);
        console.log(`Kullanıcı: ${user.email}`);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

addTestCoupon();
