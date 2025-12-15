const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

// Auth Routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Token ile kullanıcı bilgisi
router.get("/me", requireAuth, authController.me);

// Logout
router.post("/logout", requireAuth, authController.logout);

// Şifre unutma
router.post("/forgot-password", authController.forgotPassword);

// Şifre resetleme
router.post("/reset-password", authController.resetPassword);

module.exports = router;
