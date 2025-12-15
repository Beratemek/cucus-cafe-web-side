const express = require("express");
const router = express.Router();

const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

// Tüm kullanıcıları görme
router.get(
  "/users",
  requireAuth,
  authorizeRoles("admin"),
  adminController.getAllUsers
);

// Email ile kullanıcı arama (ÜSTE ALDIK!)
router.get(
  "/users/search",
  requireAuth,
  authorizeRoles("admin"),
  adminController.searchUserByEmail
);

//Tek kullanıcı detayı
router.get(
  "/users/:id",
  requireAuth,
  authorizeRoles("admin"),
  adminController.getUserById
);

//Kullanıcı silme
router.delete(
  "/users/:id",
  requireAuth,
  authorizeRoles("admin"),
  adminController.deleteUser
);

//Puan geçmişi
router.get(
  "/users/:id/history",
  requireAuth,
  authorizeRoles("admin"),
  adminController.getUserPointsHistory
);

module.exports = router;
