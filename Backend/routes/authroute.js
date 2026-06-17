const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many login attempts, Try again later.',
  },
});

// These are the exact endpoints that will attach to your app.use('/auth', ...)
router.post('/signup', authController.signup);
router.post('/login', loginLimiter, authController.login);
router.get('/verify-email', authController.verifyEmail);

module.exports = router;
