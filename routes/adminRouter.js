const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// DASHBOARD -> GET /admin
router.get('/', adminController.showDashboard);

router.get('/products', adminController.showProducts);

router.get('/products/add', adminController.addProductGET);

router.post('/products/add', adminController.addProductPOST);

router.get('/products/update/:id', adminController.updateProductGET);

router.post('/products/update/:id', adminController.updateProductPOST);
router.get('/products/delete/:id', adminController.deleteProductGET);
router.post('/products/delete/:id', adminController.deleteProductPOST);


module.exports = router;
