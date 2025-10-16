const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { generateNumericOTP } = require('../utils/otpGenerator');
const { otpEmailTemplate, forgotPasswordEmailTemplate } = require('../utils/emailTemplates');
const { createTransporter } = require('../config/nodemailer');
const { signToken } = require('../config/jwt');

const transporter = createTransporter();
const APP_NAME = process.env.APP_NAME || 'My App';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, confirmPassword, username } = req.body || {};

    if (!email || !password || !confirmPassword || !username) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 8 ký tự' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and hash OTP before storing
    const otpCodePlain = generateNumericOTP(6);
    const otpHash = await bcrypt.hash(otpCodePlain, 10);

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      otpCode: otpHash,
      otpExpires,
    });

    // Send OTP email
    await transporter.sendMail({
      to: email,
      subject: `Xác thực tài khoản - ${APP_NAME}`,
      html: otpEmailTemplate(otpCodePlain),
    });

    return res.status(201).json({ message: 'Đăng ký thành công, vui lòng kiểm tra email để xác thực' });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body || {};

    if (!email || !otpCode) {
      return res.status(400).json({ message: 'Thiếu email hoặc mã OTP' });
    }

    if (!/^\d{6}$/.test(String(otpCode))) {
      return res.status(400).json({ message: 'OTP phải gồm 6 chữ số' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });
    if (user.isVerified) return res.status(400).json({ message: 'Tài khoản đã xác thực' });
    if (!user.otpCode || !user.otpExpires) {
      return res.status(400).json({ message: 'OTP không hợp lệ' });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP đã hết hạn' });
    }

    const isMatch = await bcrypt.compare(String(otpCode), user.otpCode);
    if (!isMatch) {
      return res.status(400).json({ message: 'OTP không chính xác' });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Xác thực thành công, bạn có thể đăng nhập' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/auth/resend-otp
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Thiếu email' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });
    if (user.isVerified) return res.status(400).json({ message: 'Tài khoản đã xác thực' });

    const otpCodePlain = generateNumericOTP(6);
    const otpHash = await bcrypt.hash(otpCodePlain, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.otpCode = otpHash;
    user.otpExpires = otpExpires;
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: `Xác thực tài khoản - ${APP_NAME}`,
      html: otpEmailTemplate(otpCodePlain),
    });

    return res.status(200).json({ message: 'OTP đã được gửi lại' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Tài khoản chưa xác thực', redirect: '/verify-otp', email: user.email });
    }

    const token = signToken({ userId: user._id, email: user.email });

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Thiếu email' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(200).json({ message: 'Email gửi thành công' }); // do not reveal
    if (!user.isVerified) return res.status(400).json({ message: 'Tài khoản chưa xác thực' });

    // Create reset token (random 32 bytes) and store hashed version
    const resetTokenPlain = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetTokenPlain).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${FRONTEND_URL}/reset/${resetTokenPlain}`;

    await transporter.sendMail({
      to: email,
      subject: `Đặt lại mật khẩu - ${APP_NAME}`,
      html: forgotPasswordEmailTemplate(resetUrl),
    });

    return res.status(200).json({ message: 'Email gửi thành công' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/auth/reset/:token
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: 'Thiếu token' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });

    return res.status(200).json({ message: 'Token hợp lệ' });
  } catch (error) {
    console.error('Verify reset token error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body || {};
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Thiếu dữ liệu' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 8 ký tự' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.lastPasswordReset = new Date();
    await user.save();

    return res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
