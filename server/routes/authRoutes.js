// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const auth = require('../middleware/auth');

// // Public routes
// router.post('/signup', authController.signup);
// router.post('/verify-email', authController.verifyEmail);
// router.post('/verify-phone', authController.verifyPhone);
// router.post('/login', authController.login);

// // Protected routes
// router.get('/user', auth, authController.getUser);

// module.exports = router;
// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/signup', authController.signup);
router.post('/verify-email', authController.verifyEmail);
router.post('/request-otp', authController.requestOTP)
router.post('/login', authController.login);

// Protected routes
router.get('/user', auth, authController.getUser);

module.exports = router;