const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controller/authController");

// Private acess == Protect form Middleware
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
