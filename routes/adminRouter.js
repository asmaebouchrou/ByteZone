const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// LISTAR -> GET /admin/tshirt
router.get('/', adminController.showTshirts);

// AÑADIR -> GET /admin/tshirt/add
router.get('/add', adminController.addTshirtGET);

// AÑADIR -> POST /admin/tshirt/add
router.post('/add', adminController.addTshirtPOST);

// EDITAR -> GET /admin/tshirt/update/:id
router.get('/update/:id', adminController.updateTshirtGET);

// EDITAR -> POST /admin/tshirt/update/:id
router.post('/update/:id', adminController.updateTshirtPOST);

module.exports = router;