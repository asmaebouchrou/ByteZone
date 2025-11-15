const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middlewares/authTemp');

// Ver carrito
router.get('/cart', isAuthenticated, cartController.viewCart);

// Añadir producto al carrito
router.post('/cart/agregar/:id', isAuthenticated, cartController.addToCart);

// Eliminar producto del carrito
router.post('/cart/delete/:id', isAuthenticated, cartController.deleteFromCart);

//Añadir rutas GET y POST para /cart/process
router.get('/cart/process', isAuthenticated, cartController.processBuyView);

router.post('/cart/process', isAuthenticated, cartController.processBuy);


module.exports = router;
