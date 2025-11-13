const bcrypt = require('bcryptjs');
const db = require('../config/database');

module.exports = {
    showLogin: (req, res) => {
    res.render('auth/login');
  },

  processLogin: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('auth/login', { error: 'Please fill in all fields.' });
    }

    try {
      const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
      const user = rows[0];

      if (!user) {
        return res.status(401).render('auth/login', { error: 'User not found.' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).render('auth/login', { error: 'Incorrect password.' });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role || 'client'
      };

      console.log(`User ${user.username} logged in`);

      if (user.role === 'admin') {
        res.redirect('/admin');
      } else {
        res.redirect('/tshirts');
      }

    } catch (error) {
      console.error('Error at login:', error);
      res.status(500).render('auth/login', { error: 'Server error. Please try again later.' });
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  }
};
