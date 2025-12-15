const jwt = require("jsonwebtoken");

// Login zorunluluğu (Token var mı, geçerli mi?)
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Yetkisiz erişim: Token yok!" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    // token içinde -> { id, email, role } zaten var
    next();
  } catch (err) {
    console.log("Auth Error:", err);
    return res.status(401).json({ message: "Token geçersiz!" });
  }
};

// Rol yetkisi kontrolü
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Bu işlem için yetkin yok!" });
    }
    next();
  };
};

// EXPORT
module.exports = {
  requireAuth,
  authorizeRoles
};
