const axios = require('axios');

const API_URL = 'http://localhost:4000';

async function test() {
    try {
        console.log('🚀 API BAĞLANTI TESTI...\n');

        // Healthcheck
        console.log('1️⃣  Sunucu Kontrolü:');
        const healthResponse = await axios.get(`${API_URL}/`).catch(() => null);
        if (healthResponse) {
            console.log('✅ Sunucu çalışıyor\n');
        } else {
            console.log('⚠️  API başlıyor, biraz bekle...\n');
        }

        // Ürünleri listele
        console.log('2️⃣  Ürünler:');
        const productsResponse = await axios.get(`${API_URL}/products`);
        const espresso = productsResponse.data.find(p => p.name === 'Espresso');
        const cheesecake = productsResponse.data.find(p => p.name === 'Klise Limonlu Cheesecake');

        console.log(`✅ Espresso (ID: ${espresso._id}, Kategori: ${espresso.category})`);
        console.log(`✅ Cheesecake (ID: ${cheesecake._id}, Kategori: ${cheesecake.category})\n`);

        // Kullanıcıları listele
        console.log('3️⃣  Test Kullanıcıları:');
        try {
            const usersResponse = await axios.get(`${API_URL}/admin/list-users`);
            console.log(`✅ ${usersResponse.data.length} kullanıcı bulundu\n`);
        } catch (e) {
            console.log('⚠️  Admin endpoint erişilemedi\n');
        }

        console.log('✅ TÜM KONTROLLER TAMAMLANDI!');
        console.log('Şimdi Postman/Thunder Client ile manuel testler yapabilirsin.\n');

    } catch (error) {
        console.error('❌ HATA:', error.message);
    }
}

test();
