const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    coupons: Array,
    loyalty: {
        sadakat_no: Number,
        points: { type: Number, default: 0 },
        history: Array
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function resetCoupons() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Bağlandı\n');

        // Yıldız Tilbe'yi bul
        const user = await User.findOne({
            name: 'Yıldız',
            surname: 'Tilbe'
        });

        if (!user) {
            console.log('❌ Kullanıcı bulunamadı: Yıldız Tilbe');
            await mongoose.connection.close();
            return;
        }

        console.log(`👤 Kullanıcı: ${user.name} ${user.surname}`);
        console.log(`   Mevcut Kuponlar: ${user.coupons.length}`);

        // Eski kuponları sil
        user.coupons = [];
        await user.save();

        console.log(`\n✅ Tüm Kuponlar Silindi!`);
        console.log(`\n🎟️  Yeni Kupon Oluşturmak İçin:`);
        console.log(`   1. Profil sayfasına git`);
        console.log(`   2. "Puanlarım" bölümüne bak (Puan: ${user.loyalty.points})`);
        console.log(`   3. "Ücretsiz Kahve Kuponu Al" butonuna tıkla`);
        console.log(`   4. Yeni kupon oluşturulacak (validSizes ile)`);

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ HATA:', error.message);
        process.exit(1);
    }
}

resetCoupons();
