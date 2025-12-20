const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");
const { requireAuth, authorizeRoles } = require("../middleware/authMiddleware");

// Herkes kampanyaları görebilir
router.get("/", campaignController.getAllCampaigns);
router.get("/:id", campaignController.getCampaignById);

// Sadece Admin kampanya yönetebilir
router.post("/", requireAuth, authorizeRoles("admin"), campaignController.createCampaign);
router.put("/:id", requireAuth, authorizeRoles("admin"), campaignController.updateCampaign);
router.delete("/:id", requireAuth, authorizeRoles("admin"), campaignController.deleteCampaign);
router.patch("/:id/toggle", requireAuth, authorizeRoles("admin"), campaignController.toggleCampaignStatus);

// Kullanıcı işlemleri (Giriş yapmış kullanıcılar)
router.post("/verify-code", requireAuth, campaignController.validateCampaignCode);
router.post("/apply-code", requireAuth, campaignController.applyCampaignCode);

module.exports = router;
