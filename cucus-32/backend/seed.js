const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/product"); // Model yolunun doğru olduğundan emin ol

// .env dosyasını oku
dotenv.config();

// Veritabanı Bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Bağlandı... Veriler yükleniyor..."))
  .catch((err) => console.log(err));

// --- TÜM MENÜ VERİLERİ ---
const products = [
  // 1. CAKES & DESSERTS (category: 'cakes')
  {
    name: 'Çok Çok Çikolatalı Browni',
    description: 'Bitter ve Beyaz Çikolata eşliğinde',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Standart', price: 250 }]
  },
  {
    name: 'İddialı San Sebastian',
    description: 'Sütlü Çikolata eşliğinde',
    category: 'cakes',
    image: 'https://i.imgur.com/fFRO1BW.jpeg',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 250 }]
  },
  {
    name: 'Bitter Çikolatalı San Sebastian',
    description: 'Bitter Çikolata ve Çikolata parçacıkları eşliğinde',
    category: 'cakes',
    image: 'https://i.imgur.com/NtSyobD.jpeg',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 280 }]
  },
  {
    name: 'Urfadan Antep Fıstıklı San Sebastian',
    description: 'Antep fıstığı sosu ve Antep fıstığı kırıntısı eşliğinde',
    category: 'cakes',
    image: 'https://i.imgur.com/VukSCTN.jpeg',
    isPopular: true,
    sizes: [{ size: 'Standart', price: 260 }]
  },
  {
    name: 'Bir Ilık Lotuslu San Sebastian',
    description: 'Lotus Bisküvisi ve Caramel sosu eşliğinde',
    category: 'cakes',
    image: 'https://i.imgur.com/BLC6Bx4.jpeg',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 270 }]
  },
  {
    name: 'Fransız Lezzeti Cream Puff',
    description: 'Sütlü Çikolata ve Fındık kreması eşliğinde',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1702234867439-bec43ed4e369?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 250 }]
  },
  {
    name: 'Dubai Cream Puff',
    description: 'Sütlü Çikolata, Antep fıstığı sosu ve Antep fıstığı kırıntısı eşliğinde',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1633424411336-f5b7a6886d88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Standart', price: 270 }]
  },
  {
    name: 'CuCuS Special Frambuazlı Cookie',
    description: 'Beyaz Çikolata eşliğinde',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1611082191524-1c049443f288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 200 }]
  },
  {
    name: 'Bol Çikolatalı Cookie',
    description: 'Bitter Çikolata eşliğinde',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1657418830273-40c19cfff4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Standart', price: 150 }]
  },
  {
    name: 'Lezzetli Şirin Muffin',
    description: '',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1601390387542-22acd08d6029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 130 }]
  },
  {
    name: 'Klise Limonlu Cheesecake',
    description: '',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1710362778452-07fabf048bb1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 220 }]
  },
  {
    name: 'Çikolatalı Cheesecake',
    description: '',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Standart', price: 210 }]
  },
  {
    name: 'Krem Sokola Beyaz Çikolatalı',
    description: '',
    category: 'cakes',
    image: 'https://i.imgur.com/u5d2vSG.jpeg',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 190 }]
  },
  {
    name: 'Tiramisu',
    description: '',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1714385905983-6f8e06fffae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Standart', price: 180 }]
  },
  {
    name: 'Havuçlu Cevizli Kek',
    description: 'Beyaz Çikolata eşliğinde',
    category: 'cakes',
    image: 'https://i.imgur.com/nsvg304.jpeg',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 140 }]
  },
  {
    name: 'Cookielı Browni',
    description: 'Bitter ve Beyaz Çikolata eşliğinde',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1648150710000-c30fd7ac012e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 270 }]
  },
  {
    name: 'Krem Sokola',
    description: '',
    category: 'cakes',
    image: 'https://i.imgur.com/dyonsbf.jpeg',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 190 }]
  },
  {
    name: 'Shoot!? Tiramisu',
    description: '',
    category: 'cakes',
    image: 'https://i.imgur.com/6EBfdkP.jpeg',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 200 }]
  },
  {
    name: 'Kleopatra Tabağı',
    description: 'CuCuS Browniesi, Kreması, Çikolata sosu ve son dokunuş kuru yemiş pirinç patlağı eşliğinde',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1673960899321-0f0b69778659?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Standart', price: 280 }]
  },
  {
    name: 'Satilli Browni',
    description: '',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1570145820259-b5b80c5c8bd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 300 }]
  },
  {
    name: 'Modern Mozaik',
    description: 'Sütlü çikolata eşliğinde',
    category: 'cakes',
    image: 'https://images.unsplash.com/photo-1605807638645-6f18b0bd0d36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 170 }]
  },

  // 2. COCKTAILS (category: 'cocktail')
  {
    name: 'Mor Ötesi',
    category: 'cocktail',
    image: 'https://images.unsplash.com/photo-1607547023948-57254fde4f0b?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 200 }]
  },
  {
    name: 'Blue Dragon',
    category: 'cocktail',
    image: 'https://images.unsplash.com/photo-1559842623-b82d2e1228a5?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 200 }]
  },
  {
    name: 'Aurora',
    category: 'cocktail',
    image: 'https://images.unsplash.com/photo-1599566097412-69d00510d74a?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 200 }]
  },

  // 3. COLD DRINKS (category: 'cold-drinks')
  {
    name: 'Churchill',
    category: 'cold-drinks',
    image: 'https://i.imgur.com/mjDxDdL.jpeg',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 120 }]
  },
  {
    name: 'Limonata',
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1586161714062-3e0d1815f4cf?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 130 }]
  },
  {
    name: 'Berry Hibiscus',
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1630823183901-0b3207fa9f1b?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Cool Lime',
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1725800501711-687f65117e7a?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'White Coco Berry',
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1708195992982-68e5420e089e?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 180 }]
  },
  {
    name: 'Yellow Breeze',
    category: 'cold-drinks',
    image: 'https://i.imgur.com/RBdTLEp.jpeg',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 180 }]
  },
  {
    name: 'Karpuz Nane Limonata',
    category: 'cold-drinks',
    image: 'https://i.imgur.com/s0TgShb.jpeg',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 140 }]
  },
  {
    name: 'Kavun Çilek Limonata',
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1746588394961-923aeda3f158?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 140 }]
  },
  {
    name: 'Mor Ötesi Limonata',
    category: 'cold-drinks',
    image: 'https://images.unsplash.com/photo-1542518392-13317b1ee2a2?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 150 }]
  },

  // 4. FRAPPE (category: 'frappe')
  {
    name: 'Chocolate Frappe',
    category: 'frappe',
    image: 'https://images.unsplash.com/photo-1586985288206-3cdc4f67cd03?q=80&w=1920',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Vanilla Frappe',
    category: 'frappe',
    image: 'https://images.unsplash.com/photo-1637590594015-9caa6148d381?q=80&w=1920',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Caramel Frappe',
    category: 'frappe',
    image: 'https://images.unsplash.com/photo-1662192511709-e75d67367638?q=80&w=1920',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },

  // 5. FROZEN (category: 'frozen')
  {
    name: 'SkyWish',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1642646981541-6f6d56ebaddc?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 200 }]
  },
  {
    name: 'Lime & Lemon Frozen',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1625860448256-142933059c77?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Lemonade & Strawberry Frozen',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1719317007092-7b2931aa36b1?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Strawberry Frozen',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1594082685307-31c2c5bb1f59?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Red Forest Fruit Frozen',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1613072742870-fb2d87a28220?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Apple Frozen',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1727989815707-1b9e8f376775?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'CuCus Sorbe',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1590061062944-38f1dacd5328?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 180 }]
  },

  // 6. HOT BEVERAGES (category: 'hot-beverages')
  {
    name: 'Çay',
    category: 'hot-beverages',
    image: 'https://images.unsplash.com/photo-1560799261-ed4de581757b?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 50 }, { size: 'Büyük', price: 80 }]
  },
  {
    name: 'Herbal Tea',
    category: 'hot-beverages',
    image: 'https://images.unsplash.com/photo-1675155337816-5002bb718d73?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 150 }]
  },
  {
    name: 'Hot Chocolate',
    category: 'hot-beverages',
    image: 'https://images.unsplash.com/photo-1720664282854-6081564f7e88?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 150 }]
  },
  {
    name: 'Hot Coco Choco',
    category: 'hot-beverages',
    image: 'https://images.unsplash.com/photo-1643641543738-04aac0809fb0?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 150 }]
  },
  {
    name: 'Hot Coffee Toffee',
    category: 'hot-beverages',
    image: 'https://images.unsplash.com/photo-1633966094251-8e656bc6300d?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 150 }]
  },
  {
    name: 'Salep',
    category: 'hot-beverages',
    image: 'https://i.imgur.com/FOOFzrD.jpeg',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 150 }]
  },
  {
    name: 'Chai Tea Latte',
    category: 'hot-beverages',
    image: 'https://images.unsplash.com/photo-1651789276450-2ba99bf5f270?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 150 }]
  },
  {
    name: 'Italy Caramella',
    category: 'hot-beverages',
    image: 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 150 }]
  },

  // 7. ICED COFFEES (category: 'iced-coffees')
  {
    name: 'Iced Americano',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1681026859292-58c3b2041bfd?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 140 }]
  },
  {
    name: 'Iced Filtre',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1595827295672-97a059484442?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 135 }]
  },
  {
    name: 'Iced Latte',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1686575669781-74e03080541b?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 145 }]
  },
  {
    name: 'Iced CUCUS Latte',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1564327367587-8808ebf012fe?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Iced Mocha',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 155 }]
  },
  {
    name: 'Iced White Mocha',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1557772611-722dabe20327?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 155 }]
  },
  {
    name: 'Iced Lotulslı Latte',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1587726713750-219a3542fb6d?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Iced Zebra Mocha',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1705448315484-5715a3f0323a?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 155 }]
  },
  {
    name: 'Iced Caramel Latte',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 155 }]
  },
  {
    name: 'Iced Nutella Latte',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1637590594015-9caa6148d381?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Iced Chai Latte',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1604959807242-9eb8fd0b5bfa?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 145 }]
  },
  {
    name: 'Iced Italy Caramella',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 155 }]
  },
  {
    name: 'Iced Coffee Toffee',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1695741996464-857c90c635c3?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 145 }]
  },
  {
    name: 'Iced Matcha Latte',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1708572808503-48242f5c9a89?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 210 }]
  },
  {
    name: 'Iced Salty Caramel Mocha',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1675229502792-1011e47b427f?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Iced Caramel Macchiato',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1662047102608-a6f2e492411f?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 160 }]
  },
  {
    name: 'Iced Toffee Nut Cafe Latte',
    category: 'iced-coffees',
    image: 'https://images.unsplash.com/photo-1637590594015-9caa6148d381?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 155 }]
  },

  // 8. MILKSHAKE (category: 'milkshake')
  {
    name: 'Chocolate Milkshake',
    category: 'milkshake',
    image: 'https://images.unsplash.com/photo-1590373927063-cb2d69209a8b?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 155 }]
  },
  {
    name: 'Vanilla Milkshake',
    category: 'milkshake',
    image: 'https://images.unsplash.com/photo-1734747643067-6d4e0f705a00?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 155 }]
  },
  {
    name: 'Strawberry Milkshake',
    category: 'milkshake',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 155 }]
  },
  {
    name: 'Banana Milkshake',
    category: 'milkshake',
    image: 'https://images.unsplash.com/photo-1685967836529-b0e8d6938227?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 155 }]
  },
  {
    name: 'Biscuit Milkshake',
    category: 'milkshake',
    image: 'https://images.unsplash.com/photo-1647786028279-58e5a9669f6d?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 160 }]
  },
  {
    name: 'Protein Milkshake',
    category: 'milkshake',
    image: 'https://i.imgur.com/dmrefMb.jpeg',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 180 }]
  },

  // 9. SANDWICH (category: 'sandwich')
  {
    name: 'Dana Jambon Sandiviç',
    category: 'sandwich',
    image: 'https://i.imgur.com/9agUbKF.jpeg',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 220 }]
  },

  // 10. SMOOTHIE (category: 'smoothie')
  {
    name: 'Strawberry Smoothie',
    category: 'smoothie',
    image: 'https://images.unsplash.com/photo-1622597468158-27733896a49d?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Red Forest Fruit Smoothie',
    category: 'smoothie',
    image: 'https://images.unsplash.com/photo-1633338380828-527956cb6efc?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },
  {
    name: 'Banana Smoothie',
    category: 'smoothie',
    image: 'https://images.unsplash.com/photo-1685967836529-b0e8d6938227?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 165 }]
  },

  // 11. SPECIAL COFFEES (category: 'special-coffee')
  {
    name: 'Cucuś Latte',
    category: 'special-coffee',
    image: 'https://i.imgur.com/RhO5tcc.jpeg',
    isPopular: true,
    sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }]
  },
  {
    name: 'Salty Caramel Mocha',
    category: 'special-coffee',
    image: 'https://i.imgur.com/1CaqFiT.jpeg',
    isPopular: true,
    sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }]
  },
  {
    name: 'Raspberry Mocha',
    category: 'special-coffee',
    image: 'https://i.imgur.com/jWPFJ7f.jpeg',
    isPopular: false,
    sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }]
  },
  {
    name: 'Zebra Mocha',
    category: 'special-coffee',
    image: 'https://i.imgur.com/0IU0bKj.jpeg',
    isPopular: false,
    sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }]
  },
  {
    name: 'Nutella Latte',
    category: 'special-coffee',
    image: 'https://i.imgur.com/NNQwV6w.jpeg',
    isPopular: true,
    sizes: [{ size: 'Short', price: 165 }, { size: 'Tall', price: 180 }]
  },
  {
    name: 'Sifa Latte',
    category: 'special-coffee',
    image: 'https://images.unsplash.com/photo-1558019939-63dfb181280b?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }]
  },
  {
    name: 'Affogato',
    category: 'special-coffee',
    image: 'https://images.unsplash.com/photo-1638543284847-3a6bed3e1689?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Short', price: 200 }]
  },
  {
    name: 'Watermelon White Mocha',
    category: 'special-coffee',
    image: 'https://images.unsplash.com/photo-1592858521880-ce49b8e9194b?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }]
  },
  {
    name: 'Matcha Latte',
    category: 'special-coffee',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Short', price: 190 }, { size: 'Tall', price: 220 }]
  },

  // 12. STANDARD COFFEES (category: 'standard-coffee')
  {
    name: 'Türk Kahvesi',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1576685880864-50b3b35f1c55?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 100 }, { size: 'Büyük', price: 130 }]
  },
  {
    name: 'Dibek Kahvesi',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1672570050756-4f1953bde478?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 120 }, { size: 'Büyük', price: 160 }]
  },
  {
    name: 'Menengiç Kahvesi',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1631149206144-4549c0468787?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 120 }, { size: 'Büyük', price: 160 }]
  },
  {
    name: 'Espresso',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1652391466264-9742101ffe54?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Standart', price: 90 }]
  },
  {
    name: 'Doppio Espresso',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1634234498465-a3a63b112256?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 105 }]
  },
  {
    name: 'Espresso Macchiato',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1597676345712-ba4536073513?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Standart', price: 100 }]
  },
  {
    name: 'Americano',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1653842374251-32169fbf7d34?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 130 }, { size: 'Büyük', price: 145 }]
  },
  {
    name: 'Filtre Kahve',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1743623922003-c5448b9f0956?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 120 }, { size: 'Büyük', price: 135 }]
  },
  {
    name: 'Cafe Latte',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1669162364316-a74b2d661d1e?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 140 }, { size: 'Büyük', price: 155 }]
  },
  {
    name: 'Cappuccino',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1643909618082-d916d591c2a2?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 140 }, { size: 'Büyük', price: 155 }]
  },
  {
    name: 'Cortado',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1749105862041-d7e03c78eccb?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 145 }]
  },
  {
    name: 'Flat White',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1727080409436-356bdc609899?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 145 }]
  },
  {
    name: 'Mocha',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1619286310410-a95de97b0aec?q=80&w=1080',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }]
  },
  {
    name: 'White Mocha',
    category: 'standard-coffee',
    image: 'https://i.imgur.com/LxrFief.jpeg',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }]
  },
  {
    name: 'Caramel Macchiato',
    category: 'standard-coffee',
    image: 'https://i.imgur.com/Vfq6w9k.jpeg',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }]
  },
  {
    name: 'Creme Brulee Cafe Latte',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }]
  },
  {
    name: 'Lotuslu Cafe Latte',
    category: 'standard-coffee',
    image: 'https://i.imgur.com/m2W5V8f.jpeg',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }]
  },
  {
    name: 'Pumpkin Cafe Latte',
    category: 'standard-coffee',
    image: 'https://images.unsplash.com/photo-1569383893830-b73dc4a03af0?q=80&w=1080',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }]
  },
  {
    name: 'Caramel Cafe Latte',
    category: 'standard-coffee',
    image: 'https://i.imgur.com/yGZcg2e.jpeg',
    isPopular: true,
    sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }]
  },
  {
    name: 'Toffee Nut Cafe Latte',
    category: 'standard-coffee',
    image: 'https://i.imgur.com/aporibO.jpeg',
    isPopular: false,
    sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }]
  }
];

const seedDB = async () => {
  try {
    await Product.deleteMany({}); // Önce temizle
    await Product.insertMany(products); // Sonra hepsini ekle
    console.log("Veriler başarıyla yüklendi!");
  } catch (error) {
    console.error("Hata:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();