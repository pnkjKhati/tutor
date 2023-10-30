const otpGenerator = require("otp-generator");
const OTP = require("../models/otpModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { status } = require("../../constants");

const sendOTP = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });
    // If user found with provided email
    if (checkUserPresent) {
      res.status(401);
      throw new Error("User already present!");
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(status.SUCCESS).json({
      statusCode: status.SUCCESS,
      title: "Success",
      message: "OTP sent successfully",
      // otp,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500);
    throw new Error(error.message);
  }
});

const verifyOTOP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    res.status(400);
    throw new Error("Please Enter OTP");
  } else {
    const result = await OTP.findOne({ otp });
    if (!result) {
      res.status(400);
      throw new Error("Please enter a valid OTP!");
    } else {
      await OTP.deleteOne(result);
      res.status(status.SUCCESS).json({
        statusCode: status.SUCCESS,
        title: "Success",
        message: "OTP Verified!",
      });
    }
  }
});

module.exports = { sendOTP, verifyOTOP };
