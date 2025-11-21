const express = require('express');
const router = express.Router();
const tshirtController = require('../controllers/adminController');
const adminController = require('../controllers/adminController');

router.get('/', adminController.showTshirts);
router.get('/add', adminController.addTshirtGET);
router.post('/add', adminController.addTshirtPOST);

module.exports = router;