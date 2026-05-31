const db = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = {
  listUsers: async (req, res) => {
    try {
      const [rows] = await db.query(
        'SELECT id, username, email, role, phone, address FROM user'
      );
      res.render('admin/user/list', { users: rows });
    } catch (err) {
      console.error('Error al listar usuarios:', err);
      res.status(500).send('Error al cargar la lista de usuarios');
    }
  },

  renderAddUser: (req, res) => {
    res.render('admin/user/add');
  },

  createUser: async (req, res) => {
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
  },

  renderUpdateUser: async (req, res) => {
    const { id } = req.params;

    try {
      const [rows] = await db.query(
        'SELECT id, username, email, role, phone, address FROM user WHERE id = ?',
        [id]
      );

      if (!rows || rows.length === 0) {
        return res.status(404).send('Usuario no encontrado');
      }

      return res.render('admin/user/update', { user: rows[0] });
    } catch (err) {
      console.error('Error al obtener usuario para editar:', err);
      return res.status(500).send('Error al cargar el usuario');
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { username, email, role, phone, address } = req.body;

    if (!username || !email || !role) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    const dbRole =
      role === 'OPERATOR' || role === 'admin' || role === 'ADMIN'
        ? 'OPERATOR'
        : 'CLIENT';

    try {
      await db.query(
        `UPDATE user
         SET username = ?, email = ?, role = ?, phone = ?, address = ?
         WHERE id = ?`,
        [username, email, dbRole, phone || null, address || null, id]
      );

      return res.redirect('/admin/user');
    } catch (err) {
      console.error('Error al actualizar usuario:', err);

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('El email ya está registrado');
      }

      return res.status(500).send('Error al actualizar usuario');
    }
  },

  renderDeleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      const [rows] = await db.query(
        'SELECT id, username, email, role, phone, address FROM user WHERE id = ?',
        [id]
      );

      if (!rows || rows.length === 0) {
        return res.status(404).send('Usuario no encontrado');
      }

      return res.render('admin/user/delete', { user: rows[0] });
    } catch (err) {
      console.error('Error al obtener usuario para eliminar:', err);
      return res.status(500).send('Error al cargar el usuario');
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      await connection.query(
        `DELETE p
         FROM payment p
         INNER JOIN customer_order co ON p.customer_order_id = co.id
         WHERE co.client = ?`,
        [id]
      );

      await connection.query('DELETE FROM customer_order WHERE client = ?', [id]);
      await connection.query('DELETE FROM payment_method WHERE user_id = ?', [id]);
      await connection.query('DELETE FROM reset_tokens WHERE user_id = ?', [id]);
      await connection.query('DELETE FROM password WHERE user_id = ?', [id]);

      const [deleteResult] = await connection.query('DELETE FROM user WHERE id = ?', [id]);

      if (deleteResult.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).send('Usuario no encontrado');
      }

      await connection.commit();
      return res.redirect('/admin/user');
    } catch (err) {
      if (connection) {
        await connection.rollback();
      }
      console.error('Error al eliminar usuario:', err);
      return res.status(500).send('Error al eliminar usuario');
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
};
