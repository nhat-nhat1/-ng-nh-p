const rateLimit = require('express-rate-limit');

// 1 request per minute for OTP resend
const resendOtpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Chỉ có thể yêu cầu OTP mỗi phút một lần' },
});

// 5 requests per hour for forgot password
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Quá số lần cho phép. Thử lại sau.' },
});

module.exports = { resendOtpLimiter, forgotPasswordLimiter };
