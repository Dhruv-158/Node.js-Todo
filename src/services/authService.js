const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

exports.registerUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ 
      $or: [{ email: userData.email }, { username: userData.username }] 
    });
    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error('Email already in use');
      } else {
        throw new Error('Username already taken');
      }
    }
    const user = new User(userData);
    await user.save();
    const token = generateToken(user._id);
    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
  } catch (error) {
    throw error;
  }
};

exports.loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    const token = generateToken(user._id);
    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
  } catch (error) {
    throw error;
  }
};

exports.getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '5day' }
  );
};