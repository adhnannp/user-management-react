const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
    const imagePath = req.file.path;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { profilePicture: imagePath },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json({
      message: 'Profile picture updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture.' });
  }
};
