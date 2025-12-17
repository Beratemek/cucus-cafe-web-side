const express = require("express");
const router = express.Router();
const wheelController = require("../controllers/wheelController");
const { requireAuth } = require("../middleware/authMiddleware");

// Tüm rotalar giriş yapmış kullanıcılar için
router.post("/spin", requireAuth, wheelController.spinWheel);
router.get("/coupons", requireAuth, wheelController.getUserCoupons);
router.get("/history", requireAuth, wheelController.getWheelHistory);

// Kupon kullanma ve doğrulama
router.post("/coupons/:code/use", requireAuth, wheelController.useCoupon);
router.get("/coupons/:code/validate", requireAuth, wheelController.validateCoupon);
router.post("/convert-points", requireAuth, wheelController.convertPointsToCoupon);

module.exports = router;
