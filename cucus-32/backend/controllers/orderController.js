const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

exports.createOrder = async (req, res) => {
  try {
    // Frontend'den artık items içinde "selectedSize" da gelmeli!
    // Örn: items: [{ product: "ID...", quantity: 1, selectedSize: "Büyük Boy" }]
    const { loyaltyNo, items, pointsUsed, couponCode } = req.body;

    const user = await User.findOne({ "loyalty.sadakat_no": loyaltyNo });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı (Sadakat No hatalı)" });

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      if (item.quantity <= 0) {
        return res.status(400).json({ message: "Hatalı işlem: Ürün adedi en az 1 olmalıdır!" });
      }

      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });

      // --- YENİ MANTIK: BOYUTA GÖRE FİYAT BULMA ---

      // 1. Ürünün sizes dizisi var mı kontrol et
      if (!product.sizes || product.sizes.length === 0) {
        return res.status(400).json({ message: `${product.name} için fiyat bilgisi bulunamadı.` });
      }

      // 2. İstenen boyutu bul (Eğer frontend boyut göndermezse varsayılan olarak ilkini alabiliriz)
      let targetSizeObj;

      if (item.selectedSize) {
        // Tam eşleşme ara (Örn: "Küçük Boy" === "Küçük Boy")
        targetSizeObj = product.sizes.find(s => s.size === item.selectedSize);
      } else {
        // Eğer boyut seçilmediyse listenin ilk fiyatını baz al (Fallback)
        targetSizeObj = product.sizes[0];
      }

      if (!targetSizeObj) {
        return res.status(400).json({ message: `${product.name} için "${item.selectedSize}" boyutu bulunamadı.` });
      }

      const unitPrice = targetSizeObj.price; // Bulunan fiyat
      const amount = unitPrice * item.quantity;
      total += amount;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        selectedSize: targetSizeObj.size, // Hangi boyutu sattığımızı kaydediyoruz
        price: unitPrice
      });
      // ----------------------------------------------
    }

    // --- KUPON İŞLEMLERİ ---
    let discount = 0;
    let couponCodeUsed = null;

    if (couponCode) {
      const coupon = user.coupons.find(c => c.code === couponCode);

      if (!coupon) return res.status(400).json({ message: "Geçersiz kupon kodu!" });
      if (coupon.isUsed) return res.status(400).json({ message: "Bu kupon zaten kullanılmış!" });
      if (new Date(coupon.expiryDate) < new Date()) return res.status(400).json({ message: "Kuponun süresi dolmuş!" });

      // Kategori kısıtlaması kontrolü
      if (coupon.validCategories && coupon.validCategories.length > 0) {
        const isValidForOrder = await Promise.all(
          orderItems.map(async (item) => {
            const product = await Product.findById(item.product);
            return product && coupon.validCategories.includes(product.category);
          })
        );

        if (!isValidForOrder.every(v => v)) {
          return res.status(400).json({ message: "Bu kupon, siparişinizdeki bazı ürünlerde geçerli değil. Sadece espresso bazlı kahvelerde kullanabilirsiniz." });
        }
      }

      // Boy kısıtlaması kontrolü
      if (coupon.validSizes && coupon.validSizes.length > 0) {
        const isValidSizeForOrder = orderItems.every(item => {
          return coupon.validSizes.includes(item.selectedSize);
        });

        if (!isValidSizeForOrder) {
          return res.status(400).json({ message: "Bu kupon, seçilen ürün boyutlarında geçerli değil. Lütfen Küçük boy seçiniz." });
        }
      }

      // İndirim hesaplama (Yüzde veya Tutar)
      if (coupon.discountType === 'amount') {
        discount = coupon.discountValue;
      } else {
        // Varsayılan: Yüzde
        discount = (total * coupon.discountValue) / 100;
      }

      // İndirim toplam tutardan fazla olamaz
      if (discount > total) {
        discount = total;
      }

      total -= discount;
      couponCodeUsed = couponCode;
      coupon.isUsed = true;
    }

    // --- PUAN KULLANIMI ---
    let finalPrice = total;
    let used = 0;

    if (pointsUsed && pointsUsed > 0) {
      if (user.loyalty.points < pointsUsed) return res.status(400).json({ message: "Yetersiz puan!" });
      if (pointsUsed > total) return res.status(400).json({ message: "Puan tutarı toplam tutardan fazla olamaz!" });

      finalPrice = total - pointsUsed;
      used = pointsUsed;

      user.loyalty.points -= used;
      user.loyalty.history.push({ amount: used, type: "spend", description: "Sipariş indirimi" });
    }

    // --- PUAN KAZANMA ---
    const earned = Math.floor(finalPrice * 0.10);
    if (earned > 0) {
      user.loyalty.points += earned;
      user.loyalty.history.push({ amount: earned, type: "earn", description: "Sipariş ödülü" });
    }

    await user.save();

    // SİPARİŞİ OLUŞTUR
    const newOrder = await Order.create({
      user: user._id,
      cashier: req.user.id,
      items: orderItems,
      totalAmount: finalPrice,
      pointsEarned: earned,
      pointsUsed: used,
      couponCode: couponCodeUsed,
      discountAmount: discount
    });

    return res.status(201).json({ message: "Sipariş oluşturuldu", order: newOrder, userPoints: user.loyalty.points });

  } catch (err) {
    console.log("Create Order Error:", err);
    return res.status(500).json({ message: "Sunucu hatası: " + err.message });
  }
};

// Kupon Doğrulama (Admin için)
exports.validateOrderCoupon = async (req, res) => {
  try {
    const { loyaltyNo, couponCode } = req.body;

    if (!loyaltyNo || !couponCode) {
      return res.status(400).json({ message: "Sadakat no ve kupon kodu gereklidir." });
    }

    const user = await User.findOne({ "loyalty.sadakat_no": loyaltyNo });
    if (!user) {
      return res.status(404).json({ message: "Müşteri bulunamadı." });
    }

    const coupon = user.coupons.find(c => c.code === couponCode);

    if (!coupon) {
      return res.status(404).json({ valid: false, message: "Kupon bulunamadı!" });
    }

    if (coupon.isUsed) {
      return res.status(400).json({ valid: false, message: "Kupon zaten kullanılmış!" });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ valid: false, message: "Kuponun süresi dolmuş!" });
    }

    return res.status(200).json({
      valid: true,
      message: "Kupon geçerli!",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        earnedFrom: coupon.earnedFrom
      }
    });

  } catch (error) {
    console.error("Valudate Order Coupon Error:", error);
    return res.status(500).json({ message: "Sunucu hatası!" });
  }
};

// Tüm siparişleri listeleme (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name surname email loyalty.sadakat_no')
      .populate('cashier', 'name surname email')
      .populate('items.product', 'name price category')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Tek sipariş detayı (Admin veya kendi siparişi)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name surname email loyalty.sadakat_no')
      .populate('cashier', 'name surname email')
      .populate('items.product', 'name price category');

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    return res.status(200).json({ order });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Kullanıcının siparişlerini listeleme
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;

    const orders = await Order.find({ user: userId })
      .populate('items.product', 'name price category')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Sipariş iptal etme (Admin)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    if (order.status === "İptal Edildi") {
      return res.status(400).json({ message: "Sipariş zaten iptal edilmiş" });
    }

    order.status = "İptal Edildi";
    await order.save();

    // Puanları geri ver
    const user = await User.findById(order.user);
    if (user) {
      // Kullanılan puanları geri ekle
      if (order.pointsUsed > 0) {
        user.loyalty.points += order.pointsUsed;
        user.loyalty.history.push({
          amount: order.pointsUsed,
          type: "earn",
          description: "Sipariş iptali - puan iadesi"
        });
      }

      // Kazanılan puanları geri al
      if (order.pointsEarned > 0) {
        user.loyalty.points -= order.pointsEarned;
        user.loyalty.history.push({
          amount: order.pointsEarned,
          type: "spend",
          description: "Sipariş iptali - kazanılan puan iadesi"
        });
      }

      await user.save();
    }

    return res.status(200).json({
      message: "Sipariş iptal edildi",
      order
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};