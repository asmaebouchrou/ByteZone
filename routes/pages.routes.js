const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pagesController');

router.get('/about', pagesController.about);
router.get('/contact', pagesController.contact);
router.get('/privacy', pagesController.privacy);
router.get('/terms', pagesController.terms);

module.exports = router;
