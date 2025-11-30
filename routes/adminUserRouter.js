const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// LISTA DE USUARIOS: GET /admin/user
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, username, email, role, phone, address FROM user'
    );
    res.render('admin/user/list', { users: rows });
  } catch (err) {
    console.error('Error al listar usuarios:', err);
    res.status(500).send('Error al cargar la lista de usuarios');
  }
});

// FORMULARIO: GET /admin/user/add
router.get('/add', (req, res) => {
  res.render('admin/user/add');
});

// CREAR USUARIO: POST /admin/user/add
router.post('/add', async (req, res) => {
  try {
    const { username, email, role, password } = req.body;

    if (!username || !email || !role || !password) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    let dbRole;
    if (role === 'OPERATOR' || role === 'admin' || role === 'ADMIN') {
      dbRole = 'OPERATOR';
    } else {
      dbRole = 'CLIENT';
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [insertUser] = await db.query(
      `INSERT INTO user (username, email, role)
       VALUES (?, ?, ?)`,
      [username, email, dbRole]
    );

    const newUserId = insertUser.insertId;

    await db.query(
      `INSERT INTO password (user_id, password_hash)
       VALUES (?, ?)`,
      [newUserId, hashedPassword]
    );

    return res.redirect('/admin/user');
  } catch (err) {
    console.error('Error al crear usuario:', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).send('El email ya está registrado');
    }

    return res.status(500).send('Error al crear usuario');
  }
});

module.exports = router;
