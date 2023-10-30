const express = require("express");
const { loginUser, registerUser } = require("../controllers/userController");
const { sendOTP, verifyOTOP } = require("../controllers/otpController");

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(verifyOTOP);

module.exports = router;
