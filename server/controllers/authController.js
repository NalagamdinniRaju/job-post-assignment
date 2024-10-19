
// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const authController = {
  // Signup handler
  signup: async (req, res) => {
    try {
      const {
        name,
        phone,
        companyName,
        companyEmail,
        employeeSize
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ companyEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const emailOTP = generateOTP();
      
      // Create new user
      const user = new User({
        name,
        phone,
        companyName,
        companyEmail,
        employeeSize,
        emailOTP,
        password: emailOTP, // Temporary password
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
      });

      await user.save();

      // Send verification email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: companyEmail,
        subject: 'Verify Your Email',
        text: `Your OTP for email verification is: ${emailOTP}`
      });

      res.status(201).json({
        message: 'Registration successful. Please verify your email.'
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Email verification handler
  // verifyEmail: async (req, res) => {
  //   try {
  //     const { email, otp } = req.body;
  //     const user = await User.findOne({ companyEmail: email });

  //     if (!user || user.emailOTP !== otp || user.otpExpiry < Date.now()) {
  //       return res.status(400).json({ message: 'Invalid or expired OTP' });
  //     }

  //     user.isEmailVerified = true;
  //     user.emailOTP = undefined;
  //     await user.save();

  //     // Generate JWT token
  //     const token = jwt.sign(
  //       { userId: user._id },
  //       process.env.JWT_SECRET,
  //       { expiresIn: '24h' }
  //     );

  //     res.json({ token, message: 'Email verified successfully' });
  //   } catch (error) {
  //     res.status(400).json({ message: error.message });
  //   }
  // },
  // server/controllers/authController.js

verifyEmail: async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('Verifying email:', email, 'OTP:', otp); // Debug log

    const user = await User.findOne({ companyEmail: email });
    
    if (!user) {
      console.log('User not found'); // Debug log
      return res.status(400).json({ message: 'User not found' });
    }

    console.log('Stored OTP:', user.emailOTP); // Debug log
    console.log('OTP Expiry:', user.otpExpiry); // Debug log

    if (!user.emailOTP || user.emailOTP !== otp) {
      console.log('Invalid OTP'); // Debug log
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiry < Date.now()) {
      console.log('OTP expired'); // Debug log
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Update user status
    user.isEmailVerified = true;
    user.emailOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.companyEmail,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
},

requestOTP: async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ companyEmail: email });

    if (!user || !user.isEmailVerified) {
      return res.status(401).json({ message: 'Invalid email or account not verified' });
    }

    const otp = generateOTP();
    user.loginOTP = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Login OTP',
      text: `Your OTP for login is: ${otp}`
    });

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('RequestOTP Error:', error);
    res.status(400).json({ message: error.message });
  }
},

login: async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ companyEmail: email });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.loginOTP || !user.otpExpiry) {
      return res.status(401).json({ message: 'Please request a new OTP' });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(401).json({ message: 'OTP has expired' });
    }

    if (user.loginOTP !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Clear OTP after successful verification
    user.loginOTP = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(400).json({ message: error.message });
  }
},
  // Get user profile
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password -emailOTP');
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = authController;