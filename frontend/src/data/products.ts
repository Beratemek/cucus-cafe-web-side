import { productImages } from './productImages';

export interface ProductSize {
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sizes: ProductSize[];
  description: string;
  createdAt: string;
  tag?: string;
}

export const allProducts: Product[] = [
  // Standard Coffees
  { id: '1', name: 'Türk Kahvesi', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 100 }, { size: 'Büyük', price: 130 }], description: 'Geleneksel Türk kahvesi', createdAt: '2024-01-15' },
  { id: '2', name: 'Dibek Kahvesi', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 120 }, { size: 'Büyük', price: 160 }], description: 'Özel dibek kahvesi', createdAt: '2024-01-15' },
  { id: '3', name: 'Menengiç Kahvesi', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 120 }, { size: 'Büyük', price: 160 }], description: 'Antep fıstığı aromalı', createdAt: '2024-01-15' },
  { id: '4', name: 'Espresso', category: 'standard-coffee', sizes: [{ size: 'Standart', price: 90 }], description: 'Tek shot espresso', createdAt: '2024-01-15' },
  { id: '5', name: 'Doppio Espresso', category: 'standard-coffee', sizes: [{ size: 'Standart', price: 105 }], description: 'Çift shot espresso', createdAt: '2024-01-15' },
  { id: '6', name: 'Espresso Macchiato', category: 'standard-coffee', sizes: [{ size: 'Standart', price: 100 }], description: 'Espresso ve süt köpüğü', createdAt: '2024-01-15' },
  { id: '7', name: 'Americano', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 130 }, { size: 'Büyük', price: 145 }], description: 'Espresso ve sıcak su', createdAt: '2024-01-15' },
  { id: '8', name: 'Filtre Kahve', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 120 }, { size: 'Büyük', price: 135 }], description: 'Pour over filtre kahve', createdAt: '2024-01-15' },
  { id: '9', name: 'Cafe Latte', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 140 }, { size: 'Büyük', price: 155 }], description: 'Espresso ve buharlanmış süt', createdAt: '2024-01-15', tag: 'Popüler' },
  { id: '10', name: 'Cappuccino', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 140 }, { size: 'Büyük', price: 155 }], description: 'Espresso, süt ve köpük', createdAt: '2024-01-15', tag: 'Popüler' },
  { id: '11', name: 'Cortado', category: 'standard-coffee', sizes: [{ size: 'Standart', price: 145 }], description: 'Espresso ve az süt', createdAt: '2024-01-15' },
  { id: '12', name: 'Flat White', category: 'standard-coffee', sizes: [{ size: 'Standart', price: 145 }], description: 'Mikro köpüklü latte', createdAt: '2024-01-15' },
  { id: '13', name: 'Mocha', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }], description: 'Espresso, süt ve çikolata', createdAt: '2024-01-15' },
  { id: '14', name: 'White Mocha', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }], description: 'Beyaz çikolatalı mocha', createdAt: '2024-01-15' },
  { id: '15', name: 'Caramel Macchiato', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }], description: 'Karamel soslu özel kahve', createdAt: '2024-01-15' },
  { id: '16', name: 'Creme Brulee Cafe Latte', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }], description: 'Creme brulee aromalı latte', createdAt: '2024-01-15' },
  { id: '17', name: 'Lotuslu Cafe Latte', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }], description: 'Lotus bisküvili latte', createdAt: '2024-01-15' },
  { id: '18', name: 'Pumpkin Cafe Latte', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }], description: 'Balkabağı baharatlı latte', createdAt: '2024-01-15' },
  { id: '19', name: 'Caramel Cafe Latte', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }], description: 'Karamelli latte', createdAt: '2024-01-15' },
  { id: '20', name: 'Toffee Nut Cafe Latte', category: 'standard-coffee', sizes: [{ size: 'Küçük', price: 155 }, { size: 'Büyük', price: 170 }], description: 'Toffee nut aromalı latte', createdAt: '2024-01-15' },

  // Special Coffees
  { id: '21', name: 'Cucus Latte', category: 'special-coffee', sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }], description: 'Özel CuCu\'s latte', createdAt: '2024-01-16', tag: 'Yeni' },
  { id: '22', name: 'Salty Caramel Mocha', category: 'special-coffee', sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }], description: 'Tuzlu karamel mocha', createdAt: '2024-01-16', tag: 'Yeni' },
  { id: '23', name: 'Raspberry Mocha', category: 'special-coffee', sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }], description: 'Ahududulu mocha', createdAt: '2024-01-16', tag: 'Yeni' },
  { id: '24', name: 'Zebra Mocha', category: 'special-coffee', sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }], description: 'Zebra desenli mocha', createdAt: '2024-01-16' },
  { id: '25', name: 'Nutella Latte', category: 'special-coffee', sizes: [{ size: 'Short', price: 165 }, { size: 'Tall', price: 180 }], description: 'Nutella aromalı latte', createdAt: '2024-01-16', tag: 'Popüler' },
  { id: '26', name: 'Sifa Latte', category: 'special-coffee', sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }], description: 'Şifalı latte', createdAt: '2024-01-16' },
  { id: '27', name: 'Affogato', category: 'special-coffee', sizes: [{ size: 'Short', price: 200 }], description: 'Dondurmalı espresso', createdAt: '2024-01-16', tag: 'Popüler' },
  { id: '28', name: 'Watermelon White Mocha', category: 'special-coffee', sizes: [{ size: 'Short', price: 160 }, { size: 'Tall', price: 175 }], description: 'Karpuzlu beyaz mocha', createdAt: '2024-01-16', tag: 'Yeni' },
  { id: '29', name: 'Matcha Latte', category: 'special-coffee', sizes: [{ size: 'Short', price: 190 }, { size: 'Tall', price: 220 }], description: 'Matcha yeşil çay latte', createdAt: '2024-01-16', tag: 'Yeni' },

  // Cakes & Desserts
  { id: '30', name: 'Çok Çok Çikolatalı Browni', category: 'cakes', sizes: [{ size: 'Short', price: 250 }], description: 'Bitter ve Beyaz Çikolata eşliğinde', createdAt: '2024-01-17', tag: 'Popüler' },
  { id: '31', name: 'İddialı San Sebastian', category: 'cakes', sizes: [{ size: 'Short', price: 250 }], description: 'Sütlü Çikolata eşliğinde', createdAt: '2024-01-17', tag: 'Yeni' },
  { id: '32', name: 'Bitter Çikolatalı San Sebastian', category: 'cakes', sizes: [{ size: 'Short', price: 280 }], description: 'Bitter Çikolata ve Çikolata parçacıkları eşliğinde', createdAt: '2024-01-17' },
  { id: '33', name: 'Urfadan Antep Fıstıklı San Sebastian', category: 'cakes', sizes: [{ size: 'Short', price: 260 }], description: 'Antep fıstığı sosu ve Antep fıstığı kırıntısı eşliğinde', createdAt: '2024-01-17', tag: 'Şef Önerisi' },
  { id: '34', name: 'Bir Ilık Lotuslu San Sebastian', category: 'cakes', sizes: [{ size: 'Short', price: 270 }], description: 'Lotus Bisküvisi ve Caramel sosu eşliğinde', createdAt: '2024-01-17', tag: 'Yeni' },
  { id: '35', name: 'Fransız Lezzeti Cream Puff', category: 'cakes', sizes: [{ size: 'Short', price: 250 }], description: 'Sütlü Çikolata ve Fındık kreması eşliğinde', createdAt: '2024-01-17' },
  { id: '36', name: 'Dubai Cream Puff', category: 'cakes', sizes: [{ size: 'Short', price: 270 }], description: 'Sütlü Çikolata, Antep fıstığı sosu ve Antep fıstığı kırıntısı eşliğinde', createdAt: '2024-01-17', tag: 'Popüler' },
  { id: '37', name: 'CuCuS Spesial Frambuazlı Cookie', category: 'cakes', sizes: [{ size: 'Short', price: 200 }], description: 'Beyaz Çikolata eşliğinde', createdAt: '2024-01-17' },
  { id: '38', name: 'Bol Çikolatalı Cookie (İçi Ama)', category: 'cakes', sizes: [{ size: 'Short', price: 150 }], description: 'Bitter Çikolata eşliğinde', createdAt: '2024-01-17', tag: 'Popüler' },
  { id: '39', name: 'Lezzetli Şirin Muffin', category: 'cakes', sizes: [{ size: 'Short', price: 130 }], description: 'Çeşitli aromalarda', createdAt: '2024-01-17' },
  { id: '40', name: 'Klise Limonlu Cheesecake', category: 'cakes', sizes: [{ size: 'Short', price: 220 }], description: 'Klasik limonlu cheesecake', createdAt: '2024-01-17' },
  { id: '41', name: 'Çikolatalı Cheesecake', category: 'cakes', sizes: [{ size: 'Short', price: 210 }], description: 'Çikolatalı cheesecake', createdAt: '2024-01-17', tag: 'Şef Önerisi' },
  { id: '42', name: 'Krem Sokola Beyaz Çikolatalı', category: 'cakes', sizes: [{ size: 'Short', price: 190 }], description: 'Beyaz çikolatalı özel tatlı', createdAt: '2024-01-17' },
  { id: '43', name: 'Tiramisu', category: 'cakes', sizes: [{ size: 'Short', price: 180 }], description: 'Klasik İtalyan tiramisu', createdAt: '2024-01-17', tag: 'Popüler' },
  { id: '44', name: 'Havuçlu Cevizli Kek', category: 'cakes', sizes: [{ size: 'Short', price: 140 }], description: 'Beyaz Çikolata eşliğinde', createdAt: '2024-01-17' },
  { id: '45', name: 'Cookielı Browni', category: 'cakes', sizes: [{ size: 'Short', price: 270 }], description: 'Bitter ve Beyaz Çikolata eşliğinde', createdAt: '2024-01-17', tag: 'Yeni' },
  { id: '46', name: 'Krem Sokola', category: 'cakes', sizes: [{ size: 'Short', price: 190 }], description: 'Çikolatalı krema kek', createdAt: '2024-01-17' },
  { id: '47', name: 'Shoot!? Tiramisu', category: 'cakes', sizes: [{ size: 'Short', price: 200 }], description: 'Shot bardakta tiramisu', createdAt: '2024-01-17' },
  { id: '48', name: 'Kleopatra Tabağı', category: 'cakes', sizes: [{ size: 'Short', price: 280 }], description: 'CuCuS Browniesi, Kreması, Çikolata sosu ve son dokunuş kuru yemiş pirinç patlağı eşliğinde', createdAt: '2024-01-17', tag: 'Şef Önerisi' },
  { id: '49', name: 'Satilli Browni', category: 'cakes', sizes: [{ size: 'Short', price: 300 }], description: 'Premium browni', createdAt: '2024-01-17', tag: 'Yeni' },

  // Hot Beverages
  { id: '50', name: 'Hot Chocolate', category: 'hot-beverages', sizes: [{ size: 'Short', price: 150 }], description: 'Sıcak çikolata', createdAt: '2024-01-18', tag: 'Popüler' },
  { id: '51', name: 'Çay', category: 'hot-beverages', sizes: [{ size: 'Short', price: 50 }, { size: 'Tall', price: 80 }], description: 'Türk çayı', createdAt: '2024-01-18' },
  { id: '52', name: 'Chai Tea Latte', category: 'hot-beverages', sizes: [{ size: 'Short', price: 150 }], description: 'Baharatlı çay latte', createdAt: '2024-01-18', tag: 'Yeni' },
  { id: '53', name: 'Herbal Tea', category: 'hot-beverages', sizes: [{ size: 'Short', price: 150 }], description: 'Bitki çayı', createdAt: '2024-01-18' },
  { id: '54', name: 'Hot Coco Choco', category: 'hot-beverages', sizes: [{ size: 'Short', price: 150 }], description: 'Özel kakao karışımı', createdAt: '2024-01-18' },
  { id: '55', name: 'Hot Coffee Toffee', category: 'hot-beverages', sizes: [{ size: 'Short', price: 150 }], description: 'Toffee aromalı sıcak kahve', createdAt: '2024-01-18' },
  { id: '56', name: 'Salep', category: 'hot-beverages', sizes: [{ size: 'Short', price: 150 }], description: 'Geleneksel salep', createdAt: '2024-01-18', tag: 'Popüler' },
  { id: '57', name: 'Italy Caramella', category: 'hot-beverages', sizes: [{ size: 'Short', price: 150 }], description: 'İtalyan karamel lezzeti', createdAt: '2024-01-18', tag: 'Yeni' },

  // Iced Coffees
  { id: '58', name: 'Iced Americano', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 140 }], description: 'Buzlu americano', createdAt: '2024-01-19', tag: 'Popüler' },
  { id: '59', name: 'Iced Filtre', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 135 }], description: 'Buzlu filtre kahve', createdAt: '2024-01-19' },
  { id: '60', name: 'Iced Latte', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 145 }], description: 'Buzlu latte', createdAt: '2024-01-19', tag: 'Popüler' },
  { id: '61', name: 'Iced Cucus Latte', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 165 }], description: 'Buzlu CuCu\'s latte', createdAt: '2024-01-19', tag: 'Yeni' },
  { id: '62', name: 'Iced Mocha', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 155 }], description: 'Buzlu mocha', createdAt: '2024-01-19' },
  { id: '63', name: 'Iced White Mocha', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 155 }], description: 'Buzlu beyaz mocha', createdAt: '2024-01-19' },
  { id: '64', name: 'Iced Zebra Mocha', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 155 }], description: 'Buzlu zebra mocha', createdAt: '2024-01-19', tag: 'Yeni' },
  { id: '65', name: 'Iced Caramel Latte', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 155 }], description: 'Buzlu karamel latte', createdAt: '2024-01-19' },
  { id: '66', name: 'Iced Lotuslu Latte', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 165 }], description: 'Buzlu lotus latte', createdAt: '2024-01-19', tag: 'Popüler' },
  { id: '67', name: 'Iced Nutella Latte', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 165 }], description: 'Buzlu nutella latte', createdAt: '2024-01-19', tag: 'Popüler' },
  { id: '68', name: 'Iced Chai Latte', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 145 }], description: 'Buzlu chai latte', createdAt: '2024-01-19' },
  { id: '69', name: 'Iced İtaly Caramella', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 155 }], description: 'Buzlu İtalyan karamel', createdAt: '2024-01-19', tag: 'Yeni' },
  { id: '70', name: 'Iced Coffee Toffee', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 145 }], description: 'Buzlu toffee kahve', createdAt: '2024-01-19' },
  { id: '71', name: 'Iced Matcha Latte', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 210 }], description: 'Buzlu matcha latte', createdAt: '2024-01-19', tag: 'Yeni' },
  { id: '72', name: 'Iced Salty Caramel Mocha', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 165 }], description: 'Buzlu tuzlu karamel mocha', createdAt: '2024-01-19' },
  { id: '73', name: 'Iced Caramel Macchiato', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 160 }], description: 'Buzlu karamel macchiato', createdAt: '2024-01-19' },
  { id: '74', name: 'Iced Toffee Nut Cafe Latte', category: 'iced-coffees', sizes: [{ size: 'Standart', price: 155 }], description: 'Buzlu toffee nut latte', createdAt: '2024-01-19' },

  // Frappe
  { id: '75', name: 'Chocolate Frappe', category: 'frappe', sizes: [{ size: 'Standart', price: 165 }], description: 'Çikolatalı frappe', createdAt: '2024-01-20', tag: 'Popüler' },
  { id: '76', name: 'Vanilla Frappe', category: 'frappe', sizes: [{ size: 'Standart', price: 165 }], description: 'Vanilyalı frappe', createdAt: '2024-01-20' },
  { id: '77', name: 'Caramel Frappe', category: 'frappe', sizes: [{ size: 'Standart', price: 165 }], description: 'Karamelli frappe', createdAt: '2024-01-20', tag: 'Popüler' },

  // Frozen
  { id: '78', name: 'SkyWish', category: 'frozen', sizes: [{ size: 'Standart', price: 200 }], description: 'SkyWish frozen', createdAt: '2024-01-22', tag: 'Yeni' },
  { id: '79', name: 'Lime & Lemon Frozen', category: 'frozen', sizes: [{ size: 'Standart', price: 165 }], description: 'Lime ve limon frozen', createdAt: '2024-01-22' },
  { id: '80', name: 'Lemonade & Strawberry Frozen', category: 'frozen', sizes: [{ size: 'Standart', price: 165 }], description: 'Limonata ve çilek frozen', createdAt: '2024-01-22', tag: 'Popüler' },
  { id: '81', name: 'Strawberry Frozen', category: 'frozen', sizes: [{ size: 'Standart', price: 165 }], description: 'Çilek frozen', createdAt: '2024-01-22', tag: 'Popüler' },
  { id: '82', name: 'Red Forest Fruit Frozen', category: 'frozen', sizes: [{ size: 'Standart', price: 165 }], description: 'Kırmızı orman meyveli frozen', createdAt: '2024-01-22' },
  { id: '83', name: 'Apple Frozen', category: 'frozen', sizes: [{ size: 'Standart', price: 165 }], description: 'Elma frozen', createdAt: '2024-01-22' },
  { id: '84', name: 'CuCus Sorbe', category: 'frozen', sizes: [{ size: 'Standart', price: 180 }], description: 'CuCu\'s özel sorbe', createdAt: '2024-01-22', tag: 'Yeni' },

  // Milkshake
  { id: '85', name: 'Chocolate Milkshake', category: 'milkshake', sizes: [{ size: 'Standart', price: 155 }], description: 'Çikolatalı milkshake', createdAt: '2024-01-21', tag: 'Popüler' },
  { id: '86', name: 'Vanilla Milkshake', category: 'milkshake', sizes: [{ size: 'Standart', price: 155 }], description: 'Vanilyalı milkshake', createdAt: '2024-01-21' },
  { id: '87', name: 'Strawberry Milkshake', category: 'milkshake', sizes: [{ size: 'Standart', price: 155 }], description: 'Çilekli milkshake', createdAt: '2024-01-21', tag: 'Popüler' },
  { id: '88', name: 'Banana Milkshake', category: 'milkshake', sizes: [{ size: 'Standart', price: 155 }], description: 'Muzlu milkshake', createdAt: '2024-01-21' },
  { id: '89', name: 'Biscuit Milkshake', category: 'milkshake', sizes: [{ size: 'Standart', price: 160 }], description: 'Bisküvili milkshake', createdAt: '2024-01-21', tag: 'Yeni' },
  { id: '90', name: 'Protein Milkshake', category: 'milkshake', sizes: [{ size: 'Standart', price: 180 }], description: 'Protein milkshake', createdAt: '2024-01-21', tag: 'Yeni' },

  // Smoothie
  { id: '91', name: 'Strawberry Smoothie', category: 'smoothie', sizes: [{ size: 'Standart', price: 165 }], description: 'Çilekli smoothie', createdAt: '2024-01-23', tag: 'Popüler' },
  { id: '92', name: 'Red Forest Fruit Smoothie', category: 'smoothie', sizes: [{ size: 'Standart', price: 165 }], description: 'Kırmızı orman meyveli smoothie', createdAt: '2024-01-23', tag: 'Popüler' },
  { id: '93', name: 'Banana Smoothie', category: 'smoothie', sizes: [{ size: 'Standart', price: 165 }], description: 'Muzlu smoothie', createdAt: '2024-01-23' },

  // Cold Drinks
  { id: '94', name: 'Churchill', category: 'cold-drinks', sizes: [{ size: 'Standart', price: 120 }], description: 'Churchill', createdAt: '2024-01-24', tag: 'Popüler' },
  { id: '95', name: 'Limonata', category: 'cold-drinks', sizes: [{ size: 'Standart', price: 130 }], description: 'Limonata', createdAt: '2024-01-24', tag: 'Popüler' },
  { id: '96', name: 'Berry Hibiscus', category: 'cold-drinks', sizes: [{ size: 'Standart', price: 165 }], description: 'Berry Hibiscus', createdAt: '2024-01-24', tag: 'Yeni' },
  { id: '97', name: 'Cool Lime', category: 'cold-drinks', sizes: [{ size: 'Standart', price: 165 }], description: 'Cool Lime', createdAt: '2024-01-24' },
  { id: '98', name: 'White Coco Berry', category: 'cold-drinks', sizes: [{ size: 'Standart', price: 180 }], description: 'White Coco Berry', createdAt: '2024-01-24' },
  { id: '99', name: 'Yellow Breeze', category: 'cold-drinks', sizes: [{ size: 'Standart', price: 180 }], description: 'Yellow Breeze', createdAt: '2024-01-24' },
  { id: '100', name: 'Karpuz Nane Limonata', category: 'cold-drinks', sizes: [{ size: 'Standart', price: 140 }], description: 'Karpuz Nane Limonata', createdAt: '2024-01-24' },
  { id: '101', name: 'Kavun Çilek Limonata', category: 'cold-drinks', sizes: [{ size: 'Standart', price: 140 }], description: 'Kavun Çilek Limonata', createdAt: '2024-01-24' },
  { id: '102', name: 'Mor Ötesi Limonata', category: 'cold-drinks', sizes: [{ size: 'Standart', price: 150 }], description: 'Mor Ötesi Limonata', createdAt: '2024-01-24' },

  // Sandwich
  { id: '103', name: 'Dana Jambon Sandviç', category: 'sandwich', sizes: [{ size: 'Standart', price: 220 }], description: 'Dana Jambon Sandviç', createdAt: '2024-01-25', tag: 'Popüler' },

  // Cocktail
  { id: '104', name: 'Mor Ötesi', category: 'cocktail', sizes: [{ size: 'Short', price: 200 }], description: 'Mor Ötesi', createdAt: '2024-01-26', tag: 'Popüler' },
  { id: '105', name: 'Blue Dragon', category: 'cocktail', sizes: [{ size: 'Short', price: 200 }], description: 'Blue Dragon', createdAt: '2024-01-26', tag: 'Popüler' },
  { id: '106', name: 'Aurora', category: 'cocktail', sizes: [{ size: 'Short', price: 200 }], description: 'Aurora', createdAt: '2024-01-26', tag: 'Yeni' },
];

// Get featured products with images from Unsplash
export const getFeaturedProducts = () => {
  // Popüler ve Yeni etiketli ürünleri filtrele
  const taggedProducts = allProducts.filter(p => p.tag === 'Popüler' || p.tag === 'Yeni');
  
  // Kategorileri dengele - her kategoriden maksimum 2 ürün
  const categoryCount: Record<string, number> = {};
  const balancedProducts: Product[] = [];
  
  // İlk önce popüler olanları, sonra yenileri sıralı ekle
  const sortedByTag = [...taggedProducts].sort((a, b) => {
    if (a.tag === 'Popüler' && b.tag !== 'Popüler') return -1;
    if (a.tag !== 'Popüler' && b.tag === 'Popüler') return 1;
    return 0;
  });

  // Her kategoriden maksimum 2 ürün ekle, dengeli dağılım için
  for (const product of sortedByTag) {
    if (!categoryCount[product.category]) {
      categoryCount[product.category] = 0;
    }
    if (categoryCount[product.category] < 2) {
      balancedProducts.push(product);
      categoryCount[product.category]++;
    }
    
    // 12 ürüne ulaştığımızda dur
    if (balancedProducts.length >= 12) break;
  }

  // Ürünleri görsel URL'leriyle birlikte döndür
  return balancedProducts.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: `${product.sizes[0].size}: ${product.sizes[0].price} ₺`,
    tag: product.tag,
    image: productImages[product.id] || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBjdXAlMjBtaW5pbWFsfGVufDF8fHx8MTc2MDUyNTM2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }));
};