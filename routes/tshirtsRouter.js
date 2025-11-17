const express = require('express');
const router = express.Router();
const tshirtsController = require('../controllers/tshirtsController');

//Controlador para ver el home de la pagina
router.get('/',tshirtsController.showTshirts );
router.get(`/${1}`,tshirtsController.showDetailTshirt );
/*
router.get('/', profileController.showProfile);

router.post('/update', profileController.updateProfile);

router.post('/change-password', profileController.changePassword);
*/
//Camisetas:
/*



*/

module.exports = router;