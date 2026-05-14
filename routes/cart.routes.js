const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { isAuthenticated } = require("../middlewares/auth");

// View cart
router.get("/cart", isAuthenticated, cartController.viewCart);

// Add item
router.get("/cart/add/product/:id", isAuthenticated, cartController.addItem);
router.post("/cart/add/product/:id", isAuthenticated, cartController.addItem);

// Remove item
router.get("/cart/del/product/:id", isAuthenticated, cartController.removeItem);
router.post("/cart/del/product/:id", isAuthenticated, cartController.removeItem);

// Checkout
router.get("/cart/checkout", isAuthenticated, cartController.processView);
router.post("/cart/checkout", isAuthenticated, cartController.processBuy);

module.exports = router;
