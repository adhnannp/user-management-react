const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fs = require('fs');
const path = require('path');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.isAdmin) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profilePicture : user.profilePicture,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error });
  }
};


exports.registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ userName, email, password });
    await newUser.save();
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        profilePicture : newUser.profilePicture,
        email: newUser.email,
        isAdmin:newUser.isAdmin
      },
      token,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error", error });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const imagePath = req.file.filename;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (user.profilePicture) {
      const currentImagePath =  path.resolve('uploads', user.profilePicture);;
      fs.unlink(currentImagePath, (err) => {
        if (err) {
          console.error('Error deleting the existing profile picture:', err);
        }
      });
    }
    user.profilePicture = imagePath;
    await user.save();

    res.status(200).json({
      message: 'Profile picture updated successfully.',
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profilePicture : user.profilePicture,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture.' });
  }
};

exports.getUser =  async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        profilePicture: user.profilePicture,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
