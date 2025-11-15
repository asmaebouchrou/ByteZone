const db = require('../config/database');
const bcrypt = require('bcryptjs');


module.exports = {

    showProfile: (req, res) => {
        res.render('client/profile', {
            user: req.session.user
        });
    },

    updateProfile: async (req, res) => {
        const { email, phone, address } = req.body; // Desestructuración, Luis estaría orgulloso
        const userId = req.session.user.id;
        try {
            const [result] = await db.query('UPDATE user SET email = ?, phone = ?, address = ? WHERE id = ?', [email, phone, address, userId]);
            req.session.user.email = email;
            req.session.user.phone = phone;
            req.session.user.address = address;
            return res.redirect('/profile');
        } catch (error) {
            console.error(error);
            return res.status(500).render('client/profile', {
                user: req.session.user,
                error: 'Could not update your profile. Try again later.'
            })
        }
    },

    changePassword: async (req, res) => {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        const userId = req.session.user.id;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).render('client/profile', {
                user: req.session.user,
                error: 'Please fill in all password fields.'
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).render('client/profile', {
                user: req.session.user,
                error: 'New passwords do not match.'
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).render('client/profile', {
                user: req.session.user,
                error: 'New password cannot be the same as the current password.'
            });
        }

        try {
            const [rows] = await db.query(
                'SELECT password_hash FROM password WHERE user_id = ?',
                [userId]
            );

            const currentHash = rows[0]?.password_hash;

            const validPassword = await bcrypt.compare(currentPassword, currentHash);

            if (!validPassword) {
                return res.status(401).render('client/profile', {
                    user: req.session.user,
                    error: 'Current password is incorrect.'
                });
            }

            const newHash = await bcrypt.hash(newPassword, 10);

            await db.query(
                'UPDATE password SET password_hash = ? WHERE user_id = ?',
                [newHash, userId]
            );

            return res.redirect('/profile');

        } catch (error) {
            console.error(error);

            return res.status(500).render('client/profile', {
                user: req.session.user,
                error: 'Could not update your password. Try again later.'
            });
        }
    }
}
