const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authTemp = require("../middlewares/authTemp");

// View cart
router.get("/cart", authTemp, cartController.viewCart);

// Add item
router.get("/cart/add/tshirt/:id", authTemp, cartController.addItem);
router.post("/cart/add/tshirt/:id", authTemp, cartController.addItem);

// Remove item
router.get("/cart/del/tshirt/:id", authTemp, cartController.removeItem);
router.post("/cart/del/tshirt/:id", authTemp, cartController.removeItem);

// Checkout
router.get("/cart/checkout", authTemp, cartController.processView);
router.post("/cart/checkout", authTemp, cartController.processBuy);

module.exports = router;