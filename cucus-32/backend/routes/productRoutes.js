const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Herkes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// Sadece Admin
router.post(
  "/",
  requireAuth,
  authorizeRoles("admin"),
  productController.createProduct
);

router.put(
  "/:id",
  requireAuth,
  authorizeRoles("admin"),
  productController.updateProduct
);

router.delete(
  "/:id",
  requireAuth,
  authorizeRoles("admin"),
  productController.deleteProduct
);

module.exports = router;
