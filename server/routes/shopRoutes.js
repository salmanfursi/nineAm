const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");
const authController = require("../controllers/authController");

router.get("/shops", shopController.getAllShops);
router.get(
  "/shop/:shopname",
  authController.authenticateToken,
  shopController.verifyShop
);

module.exports = router;
