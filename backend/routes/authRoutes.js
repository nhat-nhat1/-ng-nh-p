const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { resendOtpLimiter, forgotPasswordLimiter } = require('../middleware/rateLimit');
const {
  register,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtpLimiter, resendOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.get('/reset/:token', verifyResetToken);
router.post('/reset-password', resetPassword);

// Example protected route
router.get('/me', auth, (req, res) => {
  res.json({ message: 'Protected', user: req.user });
});

module.exports = router;
