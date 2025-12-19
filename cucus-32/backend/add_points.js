const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    loyalty: {
        sadakat_no: Number,
        points: { type: Number, default: 0 },
        history: Array
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function addPointsToUser() {
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
            console.log('\nVeritabanında olan kullanıcıları kontrol etmek için:');
            const allUsers = await User.find({}).select('name surname email loyalty.points');
            console.log(allUsers);
            await mongoose.connection.close();
            return;
        }

        console.log(`👤 Kullanıcı Bulundu:`);
        console.log(`   Ad: ${user.name} ${user.surname}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Sadakat No: ${user.loyalty.sadakat_no}`);
        console.log(`   Mevcut Puanlar: ${user.loyalty.points}\n`);

        // Puanı 500 yap
        user.loyalty.points = 500;
        user.loyalty.history.push({
            date: new Date(),
            amount: 500,
            type: 'earn',
            description: 'Admin tarafından manuel eklendi'
        });

        await user.save();

        console.log(`✅ Puanlar Güncellendi:`);
        console.log(`   Yeni Puanlar: ${user.loyalty.points}`);
        console.log(`\n🎉 Yıldız Tilbe'ye 500 puan eklendi! Artık kupon oluşturabilir.`);

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ HATA:', error.message);
        process.exit(1);
    }
}

addPointsToUser();
