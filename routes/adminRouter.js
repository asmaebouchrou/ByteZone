const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// DASHBOARD -> GET /admin
router.get('/', adminController.showDashboard);

// LISTAR -> GET /admin/tshirt
router.get('/tshirt', adminController.showTshirts);

// AÑADIR -> GET /admin/tshirt/add
router.get('/tshirt/add', adminController.addTshirtGET);

// AÑADIR -> POST /admin/tshirt/add
router.post('/tshirt/add', adminController.addTshirtPOST);

// EDITAR -> GET /admin/tshirt/update/:id
router.get('/tshirt/update/:id', adminController.updateTshirtGET);

// EDITAR -> POST /admin/tshirt/update/:id
router.post('/tshirt/update/:id', adminController.updateTshirtPOST);
router.get('/tshirt/delete/:id', adminController.deleteTshirtGET);
router.post('/tshirt/delete/:id', adminController.deleteTshirtPOST);


module.exports = router;
