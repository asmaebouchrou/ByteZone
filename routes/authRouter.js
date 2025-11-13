const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.showLogin);
router.post('/login', authController.processLogin);

router.get('/logout', authController.logout);


router.get('/signup', authController.showSignup);
router.post('/signup', authController.processSignup);
/*
router.get('/forgot-password', authController.showForgotPassword);
router.post('/forgot-password', authController.processResetPassword);
*/

module.exports = router;