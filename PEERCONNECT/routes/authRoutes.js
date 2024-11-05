const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');



// Login/Signup Page
router.get('/login', authController.getLoginSignup);

// Signup POST
router.post('/signup', authController.signup);

// Login POST
router.post('/login', authController.login);

// Logout GET 
router.get('/logout', authController.logout);

// Route to save location
router.post('/save-location', authController.saveLocation);




module.exports = router;
