const express = require('express');
const router = express.Router();
const tshirtController = require('../controllers/adminController');
const adminController = require('../controllers/adminController');

router.get('/', adminController.showTshirts);
router.get('/add', adminController.addTshirtGET);
router.post('/add', adminController.addTshirtPOST);

router.get('/delete/:id', adminController.deleteTshirtGET);
router.post('/delete/:id', adminController.deleteTshirtPOST);

// ELIMINAR -> GET /admin/tshirt/delete/:id
router.get('/delete/:id', adminController.deleteTshirtGET);

// ELIMINAR -> POST /admin/tshirt/delete/:id
router.post('/delete/:id', adminController.deleteTshirtPOST);

module.exports = router;