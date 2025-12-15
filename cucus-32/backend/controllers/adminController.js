const User = require("../models/user");

//1. Tüm kullanıcıları listeleme
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");

    return res.status(200).json({
      message: "Kullanıcılar başarıyla getirildi",
      count: users.length,
      users
    });
  } catch (error) {
    console.log("Admin Get Users Error:", error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

//2. Tek kullanıcı detayı
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Get User By Id Error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

//3. Kullanıcı silme
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
  } catch (error) {
    console.log("Delete User Error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

//4. Email ile kullanıcı arama
exports.searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email query zorunludur." });
    }

    const user = await User.findOne({ email }).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Search User Error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

//5. Kullanıcının puan geçmişi
exports.getUserPointsHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    res.status(200).json({
      userId: user._id,
      sadakat_no: user.loyalty.sadakat_no,
      points: user.loyalty.points,
      history: user.loyalty.history
    });
  } catch (error) {
    console.log("Get User History Error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
