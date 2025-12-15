const user = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateLoyaltyNumber = require('../utils/sadakatNoGenerator');
const sendEmail = require('../utils/emailService');
const crypto = require('crypto');

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

    // Doğrulama Tokenı Oluştur
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 saat

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
      },
      verificationToken,
      verificationTokenExpires
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Doğrulama Maili Gönder
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    
    const message = `
      <h1>Hesap Doğrulama</h1>
      <p>Lütfen hesabınızı doğrulamak için aşağıdaki linke tıklayın:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `;

    try {
      await sendEmail({
        email: newUser.email,
        subject: 'Email Doğrulama - CuCu\'s Coffee',
        html: message
      });
    } catch (emailError) {
      console.error("Email gönderme hatası:", emailError);
      // Email gitmese de kayıt başarılı dönebilir, kullanıcı "tekrar gönder" diyebilmeli (ileride)
    }

    res.status(201).json({
      message: "Kullanıcı oluşturuldu! Lütfen email adresinizi doğrulayın.",
      user: {
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        sadakat_no: newUser.loyalty.sadakat_no,
        points: newUser.loyalty.points,
        isVerified: false
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

//Şifre Sıfırlama İsteği (Forgot Password)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email zorunludur." });

    const u = await user.findOne({ email });
    if (!u)
      return res.status(400).json({ message: "Bu email ile kullanıcı bulunamadı." });

    // Reset Token Oluştur (Crypto ile)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // DB'ye kaydet
    u.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    u.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 dakika geçerli
    await u.save();

    // Reset URL
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const message = `
      <h1>Şifre Sıfırlama</h1>
      <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Bu link 10 dakika geçerlidir.</p>
    `;

    try {
      await sendEmail({
        email: u.email,
        subject: 'Şifre Sıfırlama - CuCu\'s Coffee',
        html: message
      });

      res.status(200).json({ message: "Şifre sıfırlama linki email adresinize gönderildi." });
    } catch (err) {
      u.resetPasswordToken = undefined;
      u.resetPasswordExpires = undefined;
      await u.save();
      return res.status(500).json({ message: "Email gönderilemedi." });
    }

  } catch (error) {
    console.log("Forgot Password Error:", error);
    return res.status(500).json({ message: "Sunucu Hatası!" });
  }
};

//Şifre Sıfırlama

//Şifre Sıfırlama İşlemi (Reset Password)
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Token ve yeni şifre zorunludur." });

    // Token hashlenerek kaydedilmişti, karşılaştırmak için gelen tokenı da hashle
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const u = await user.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() } // Süresi dolmamış olmalı
    });

    if (!u)
      return res.status(400).json({ message: "Geçersiz veya süresi dolmuş token." });

    // Yeni şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Şifreyi güncelle ve tokenları temizle
    u.passwordHash = passwordHash;
    u.resetPasswordToken = undefined;
    u.resetPasswordExpires = undefined;
    await u.save();

    return res.status(200).json({ message: "Şifre başarıyla güncellendi. Giriş yapabilirsiniz." });

  } catch (error) {
    console.log("Reset Password Error:", error);
    return res.status(500).json({ message: "Sunucu Hatası!" });
  }
};

// Email Doğrulama İşlemi
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body; // veya req.query.token (ama genelde front-end body ile atar POST requestte)
        
        const u = await user.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!u) {
            return res.status(400).json({ message: "Geçersiz veya süresi dolmuş doğrulama linki." });
        }

        u.isVerified = true;
        u.verificationToken = undefined;
        u.verificationTokenExpires = undefined;
        await u.save();

        res.status(200).json({ message: "Email başarıyla doğrulandı!" });

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Sunucu hatası." });
    }
};
