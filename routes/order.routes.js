const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middlewares/authTemp');
const orderController = require('../controllers/orderController');

// Listado de pedidos
router.get('/orders', isAuthenticated, orderController.orderList);

// Detalle del pedido
router.get('/orders/:id', isAuthenticated, orderController.orderDetail);

module.exports = router;
