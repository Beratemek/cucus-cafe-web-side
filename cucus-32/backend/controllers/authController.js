const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateLoyaltyNumber = require('../utils/sadakatNoGenerator');

//Yeni Kullanıcı Kaydı
exports.register = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res.status(400).json({ message: "Lütfen tüm alanları doldurun!" });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu email ile zaten kayıt olunmuş." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const sadakatNo = generateLoyaltyNumber();

    const newUser = await user.create({
      name,
      surname,
      email,
      passwordHash,
      role: "customer",
      loyalty: {
        sadakat_no: sadakatNo,
        points: 0,
        history: []
      }
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu!",
      user: {
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        sadakat_no: newUser.loyalty.sadakat_no,
        points: newUser.loyalty.points
      },
      token
    });

  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ message: "Sunucu hatası!" });
  }
};

//Kullanıcı Girişi Yapma
exports.login = async (req, res) => {
  try {
    //Alan Kontrolü
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email ve şifre zorunludur. " });
    }

    //Kullanıcı var mı?
    const u = await user.findOne({ email });
    if (!u)
      return res.status(400).json({ message: "Bu email ile kayıtlı kullanıcı yok." });

    //Şifre doğru mu?
    const isMatch = await bcrypt.compare(password, u.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Şifre Hatalı!" });
    }

    //Token oluştur
    const token = jwt.sign(
      { id: u._id, email: u.email, role: u.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    //Başarılı yanıt
    return res.status(200).json({
      message: "Giriş başarılı!",
      user: {
        name: u.name,
        surname: u.surname,
        email: u.email,
        role: u.role,
        sadakat_no: u.loyalty ? u.loyalty.sadakat_no : null,
        points: u.loyalty ? u.loyalty.points : 0
      },
      token
    });
  } catch (error) {
    console.error("Login Error Details:", error); // console.error kullanımı
    return res.status(500).json({ message: "Sunucu Hatası!", error: error.message }); // Hata detayını frontend'e dön (geçici olarak)
  }
};

//Bilgileri elde etme
exports.me = async (req, res) => {
  try {
    const u = await user.findById(req.user.id);

    if (!u) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({
      message: "Kullanıcı bilgileri",
      user: {
        id: u._id,
        name: u.name,
        surname: u.surname,
        email: u.email,
        role: u.role,
        sadakat_no: u.loyalty.sadakat_no,
        points: u.loyalty.points,
        history: u.loyalty.history
      }
    });
  } catch (error) {
    console.log("Me Endpoint Error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

//Çıkış Yapma
exports.logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "Çıkış yapıldı!" });
  } catch (error) {
    console.log("Logout Error:", error);
    return res.status(500).json({ message: "Sunucu Hatası!" });
  }
};

//Şifre Sıfırlama
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email zorunludur." });

    const u = await user.findOne({ email });
    if (!u)
      return res.status(400).json({ message: "Bu email ile kullanıcı bulunamadı." });

    // 10 dk geçerli token üretelim
    const resetToken = jwt.sign(
      { id: u._id, email: u.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      message: "Şifre sıfırlama token oluşturuldu.",
      resetToken
    });

  } catch (error) {
    console.log("Forgot Password Error:", error);
    return res.status(500).json({ message: "Sunucu Hatası!" });
  }
};

//Şifre Sıfırlama

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Token ve yeni şifre zorunludur." });

    // Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const u = await user.findById(decoded.id);
    if (!u)
      return res.status(400).json({ message: "Kullanıcı bulunamadı." });

    // Yeni şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Şifreyi güncelle
    u.passwordHash = passwordHash;
    await u.save();

    return res.status(200).json({ message: "Şifre başarıyla güncellendi." });

  } catch (error) {
    console.log("Reset Password Error:", error);
    return res.status(500).json({ message: "Sunucu Hatası!" });
  }
};
