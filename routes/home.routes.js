const express = require('express');
const router = express.Router();

// Importar controlador
const homeController = require('../controllers/homeController');

// Ruta principal de la web (landing)
router.get('/', homeController.home);

module.exports = router;
