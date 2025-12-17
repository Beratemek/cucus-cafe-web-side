const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Create Order Route (Admin Only)
router.post(
  "/create",
  requireAuth,
  authorizeRoles("admin"),
  orderController.createOrder
);

// Validate Coupon (Admin Only)
router.post(
  "/validate-coupon",
  requireAuth,
  authorizeRoles("admin"),
  orderController.validateOrderCoupon
);

// Get All Orders (Admin Only)
router.get(
  "/",
  requireAuth,
  authorizeRoles("admin"),
  orderController.getAllOrders
);

// Get Order by ID (Admin Only)
router.get(
  "/:id",
  requireAuth,
  authorizeRoles("admin"),
  orderController.getOrderById
);

// Get User's Orders (User can get their own, Admin can get any)
router.get(
  "/user/:userId",
  requireAuth,
  orderController.getUserOrders
);

// Cancel Order (Admin Only)
router.put(
  "/:id/cancel",
  requireAuth,
  authorizeRoles("admin"),
  orderController.cancelOrder
);

module.exports = router;