const bcrypt = require('bcryptjs');
const db = require('../config/database');
const emailService = require('../services/emailService');

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
      const [rows] = await db.query(
        'SELECT * FROM user WHERE email = ?',
        [email]
      );
      const user = rows[0];

      if (!user) {
        return res.status(401).render('auth/login', { error: 'User not found.' });
      }

      const [passRows] = await db.query(
        'SELECT password_hash FROM password WHERE user_id = ?',
        [user.id]
      );

      if (passRows.length === 0) {
        return res.status(500).render('auth/login', { error: 'Password not found for this user.' });
      }

      const passwordHash = passRows[0].password_hash;

      const validPassword = await bcrypt.compare(password, passwordHash);

      if (!validPassword) {
        return res.status(401).render('auth/login', { error: 'Incorrect password.' });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role || 'client'
      };

      console.log(`User ${user.username} logged in`);

      if (user.role === 'admin') {
        res.redirect('/admin');
      } else {
        res.redirect('/profile');
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
        .status(400).render('auth/signup', { error: 'Passwords must match.', old: req.body });

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
  },
  //FORGOT PASSWORD
  showForgotPassword: (req, res) => {
    res.render('auth/forgot-password');
  },
  processResetPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).render('auth/forgot-password', {
        error: 'Please enter your email.'
      });
    }

    try {
      const [rows] = await db.query(
        'SELECT id FROM user WHERE email = ?',
        [email]
      );

      if (rows.length === 0) {
        return res.status(400).render('auth/forgot-password', {
          error: 'No account found with that email.'
        });
      }

      const userId = rows[0].id;

      const crypto = require('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');

      const expiresAt = new Date(Date.now() + 30 * 60000);

      await db.query(
        `INSERT INTO reset_tokens (user_id, token, expires_at)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`,
        [userId, resetToken, expiresAt, resetToken, expiresAt]
      );

      const resetLink = `http://localhost:3000/auth/reset-password/${resetToken}`;

      await emailService.sendMail({
        to: email,
        subject: "Reset your T-Shirt Store password",
        html: `
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password.</p>
                <p>Click the link below to set a new password:</p>
                <a href="${resetLink}" target="_blank">
                    Reset your password
                </a>
                <p>This link expires in 30 minutes.</p>
            `
      });

      console.log("Reset email sent to:", email);

      return res.render('auth/forgot-password', {
        success: 'An email has been sent with password reset instructions.'
      });

    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);
      return res.status(500).render('auth/forgot-password', {
        error: 'Server error. Check console for details.'
      });
    }
  },
  showResetPasswordForm: async (req, res) => {
    const { token } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT user_id, expires_at FROM reset_tokens WHERE token = ?`,
            [token]
        );

        if (rows.length === 0) {
            return res.render('auth/reset-password', {
                error: 'Invalid or expired password reset link.'
            });
        }

        const tokenData = rows[0];
        const now = new Date();

        if (now > tokenData.expires_at) {
            return res.render('auth/reset-password', {
                error: 'This reset link has expired. Please request a new one.'
            });
        }

        return res.render('auth/reset-password', {
            token
        });

    } catch (err) {
        console.error("Reset password form error:", err);
        return res.render('auth/reset-password', {
            error: 'Server error. Try again later.'
        });
    }
},
processNewPassword: async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
        return res.render('auth/reset-password', {
            error: 'Please fill in all fields.',
            token
        });
    }

    if (newPassword !== confirmPassword) {
        return res.render('auth/reset-password', {
            error: 'Passwords do not match.',
            token
        });
    }

    try {
        const [rows] = await db.query(
            `SELECT user_id, expires_at 
             FROM reset_tokens
             WHERE token = ?`,
            [token]
        );

        if (rows.length === 0) {
            return res.render('auth/reset-password', {
                error: 'Invalid or expired reset link.'
            });
        }

        const { user_id, expires_at } = rows[0];

        if (new Date() > expires_at) {
            return res.render('auth/reset-password', {
                error: 'This reset link has expired.',
            });
        }

        // Hash new password
        const hashed = await bcrypt.hash(newPassword, 10);

        // Update real password
        await db.query(
            `UPDATE password SET password_hash = ? WHERE user_id = ?`,
            [hashed, user_id]
        );

        // Delete reset token so it can’t be reused
        await db.query(`DELETE FROM reset_tokens WHERE token = ?`, [token]);

        return res.render('auth/login', {
            success: 'Password updated successfully. You can now log in.'
        });

    } catch (err) {
        console.error("Reset password error:", err);
        return res.render('auth/reset-password', {
            error: 'Server error. Try again later.',
            token
        });
    }
}
};
