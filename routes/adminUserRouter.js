const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');

// LISTA DE USUARIOS: GET /admin/user
router.get('/', adminUserController.listUsers);

// FORMULARIO: GET /admin/user/add
router.get('/add', adminUserController.renderAddUser);

// CREAR USUARIO: POST /admin/user/add
router.post('/add', adminUserController.createUser);

// EDITAR USUARIO: GET /admin/user/update/:id
router.get('/update/:id', adminUserController.renderUpdateUser);

// EDITAR USUARIO: POST /admin/user/update/:id
router.post('/update/:id', adminUserController.updateUser);

// ELIMINAR USUARIO: GET /admin/user/delete/:id
router.get('/delete/:id', adminUserController.renderDeleteUser);

// ELIMINAR USUARIO: POST /admin/user/delete/:id
router.post('/delete/:id', adminUserController.deleteUser);

module.exports = router;
