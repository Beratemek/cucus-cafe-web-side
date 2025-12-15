const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Yetkisiz erişim: Token yok!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // token içindeki id, email, role buraya eklenir
    next();
  } catch (err) {
    console.log("Auth Error:", err.message);
    return res.status(401).json({ message: "Token geçersiz veya süresi dolmuş!" });
  }
};

module.exports = requireAuth;
