const jwt = require("jsonwebtoken");
const User = require("../model/User");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/* 
  @desc    Authorize a new user
  @route   POST /api/users
  @access  Public
*/
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      return res.status(400).json({
        message:
          userExists.username === username
            ? "Username already exists"
            : "Email already exists",
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/*
  @desc    Authorize user & get token
  @route   POST /api/users/login
  @access  Public
*/
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });

    // Check if user exists first
    if (!user) {
      return res.status(401).json({ message: "Invalid username or email" });
    }

    // THEN check if password matches
    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/*
  @desc    Get user profile
  @route   GET /api/users/profile
  @access  Private
*/
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
