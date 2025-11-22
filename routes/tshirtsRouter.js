const express = require('express');
const router = express.Router();
const tshirtsController = require('../controllers/tshirtsController');

//Controlador para ver el home de la pagina
router.get('/',tshirtsController.showTshirts );
router.get('/:id', tshirtsController.showDetail);


module.exports = router;