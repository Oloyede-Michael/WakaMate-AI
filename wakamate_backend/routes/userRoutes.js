const router = require("express").Router();
const {
  register,
  verifyCode,
  login,
  logout, // ✅ Import logout
} = require("../controller/userController");

// Register
router.post("/register", register);

// Email Verification
router.post("/verify", verifyCode);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout); // ✅ POST /api/user/logout

module.exports = router;
