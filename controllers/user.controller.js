const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Render Signup Page
exports.signupPage = (req, res) => {
  res.render('./pages/register');
};

// Render Login Page
exports.loginPage = (req, res) => {
  res.render('./pages/login');
};

// 🧩 Signup User
exports.signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect('/user/signup');
    }


    // Create user
    await User.create({ name, email, password, role });
    res.redirect('/user/login');
  } catch (err) {
    console.log('Signup Error:', err);
    
    res.redirect('/user/signup');
  }
};

// 🔐 Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      
      return res.redirect('/user/login');
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
  
      return res.redirect('/user/login');
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.PRIVATE_KEY,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true });
    switch (user.role) {
      case 'admin':
        return res.redirect('/admin');
      case 'manager':
        return res.redirect('/manager');
      case 'employee':
        return res.redirect('/employee');
      default:
        return res.redirect('/user/login');
    }
  } catch (err) {
    console.log('Login Error:', err);
    res.redirect('/user/login');
  }
};

exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  res.redirect('/user/login');
};
