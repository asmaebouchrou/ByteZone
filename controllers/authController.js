const bcrypt = require('bcryptjs');
const db = require('../config/database');

module.exports = {
  // LOGIN
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
  // LOGOUT
  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  },
  // SIGN UP
  showSignup: (req, res) => {
    res.render('auth/signup');
  },

  processSignup: async (req, res) => {
    const { username, email, phone, address, password, confirmPassword } = req.body;

    if (!email || !password || !username || !phone || !address || !confirmPassword) {
      return res
        .status(400).render('auth/signup', { error: 'Please fill in all fields.', old: req.body });
    }

    if (password !== confirmPassword) {
      return res
        .status(400).render('auth/signup', { error: 'Passwords must match.', old: req.body});
        
    }

    try {
      const [emailCheck] = await db.query(
        `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) AS emailExists`,
        [email]
      );

      if (emailCheck[0].emailExists === 1) {
        return res
          .status(400).render('auth/signup', { error: 'Email already in use.', old: req.body });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [insertUser] = await db.query(
        `INSERT INTO user (username, email, phone, address, role)
       VALUES (?, ?, ?, ?, 'client')`,
        [username, email, phone, address]
      );

      const newUserId = insertUser.insertId;

      await db.query(
        `INSERT INTO password (user_id, password_hash)
       VALUES (?, ?)`,
        [newUserId, hashedPassword]
      );

      req.session.user = {
        id: newUserId,
        username,
        role: 'client'
      };
      req.session.flash = { success: 'Account created successfully!' };
      return res.redirect('/auth/login'); //CAMBIAR POR /home

    } catch (error) {
      console.error('Error at signup:', error);
      return res
        .status(500).render('auth/signup', { error: 'Server error. Please try again later.' });
    }
  }
};
