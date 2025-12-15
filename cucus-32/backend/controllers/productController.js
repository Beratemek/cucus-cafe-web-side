const Product = require("../models/product");

// Ürün ekleme (Sadece Admin)
exports.createProduct = async (req, res) => {
  try {
    let { name, price, sizes, category, description, image, isPopular } = req.body;

    // --- OTOMATİK DÜZELTME BAŞLANGICI ---
    // Eğer admin panelinden "sizes" gelmediyse ama "price" geldiyse (Eski yöntem)
    // Bunu otomatik olarak yeni yapıya (sizes array'ine) çevir.
    if (!sizes || sizes.length === 0) {
      if (price) {
        sizes = [
          {
            size: "Standart",
            price: Number(price)
          }
        ];
      } else {
        return res.status(400).json({ message: "Lütfen bir fiyat veya boyut bilgisi girin!" });
      }
    }
    // --- OTOMATİK DÜZELTME BİTİŞİ ---

    if (!name || !category) {
      return res.status(400).json({ message: "Ürün adı ve kategori zorunludur!" });
    }

    const newProduct = await Product.create({
      name,
      sizes, // Artık her türlü dizi formatında olacak
      category,
      description,
      image: image || "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600",
      isPopular: isPopular || false,
      createdBy: req.user.id
    });

    return res.status(201).json({
      message: "Ürün başarıyla eklendi!",
      product: newProduct
    });
  } catch (err) {
    console.log("Create Product Error:", err);
    return res.status(500).json({ message: "Sunucu hatası!" });
  }
};

// Tüm ürünleri görme
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      count: products.length,
      products
    });
  } catch (err) {
    console.log("Get All Products Error:", err);
    return res.status(500).json({ message: "Sunucu hatası!" });
  }
};

// Tek ürün getir
exports.getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Ürün bulunamadı!" });
    return res.status(200).json(p);
  } catch (err) {
    return res.status(500).json({ message: "Sunucu hatası!" });
  }
};

// Ürün güncelleme (Sadece Admin)
exports.updateProduct = async (req, res) => {
  try {
    // --- TEMİZLİK YAPILDI ---
    // Artık 'price' kontrolü yapmıyoruz.
    // Frontend (Admin Paneli) bize güncel 'sizes' dizisini gönderiyor, biz de aynen kaydediyoruz.
    
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body, // Frontend'den gelen tüm veriyi (sizes, name, category...) basar.
      { new: true, runValidators: true } // new: güncel halini döndür, runValidators: şemaya uygun mu bak
    );

    if (!updated) {
      return res.status(404).json({ message: "Ürün bulunamadı!" });
    }

    return res.status(200).json({
      message: "Ürün başarıyla güncellendi!",
      product: updated
    });
  } catch (err) {
    console.log("Update Error:", err);
    return res.status(500).json({ message: "Sunucu hatası!" });
  }
};

// Ürün silme
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ürün bulunamadı!" });
    return res.status(200).json({ message: "Ürün silindi!" });
  } catch (err) {
    return res.status(500).json({ message: "Sunucu hatası!" });
  }
};