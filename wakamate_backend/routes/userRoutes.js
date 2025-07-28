const router = require("express").Router();
const { register, verifyCode, login } = require("../controller/userController");

//register
router.post("/register", register);

//email
router.post("/verify", verifyCode);

//login
router.post("/login", login);

module.exports = router;