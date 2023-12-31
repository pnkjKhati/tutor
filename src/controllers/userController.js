const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { status } = require("../../constants");
const jwt = require("jsonwebtoken");
const { findByIdAndUpdate } = require("../models/otpModel");

const registerUser = asyncHandler(async (req, res) => {
  const { email, phone_number, full_name, password, dob, user_name, gender } =
    req.body;
  try {
    if (
      !email ||
      !phone_number ||
      !full_name ||
      !password ||
      !dob ||
      !user_name ||
      !gender
    ) {
      res.status(400);
      throw new Error("All Fields are required!");
    } else {
      const isUserExist = await User.findOne({ email });
      if (isUserExist) {
        res.status(400);
        throw new Error("User already registered");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        phone_number,
        full_name,
        dob,
        user_name,
        password: hashedPassword,
        gender,
      });

      if (user) {
        res.status(status.CREATED).json({
          statusCode: status.CREATED,
          title: "Success",
          message: "User created successfully!",
        });
      } else {
        res.status(400);
        throw new Error("Unable to create user!");
      }
    }
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { body } = req;
  try {
    if (!(body.email || body.phone_number) || !body.password) {
      res.status(400);
      throw new Error("All fields are required");
    } else {
      let user;
      if (body.email) {
        const { email } = body;
        user = await User.findOne({ email });
      } else {
        const { phone_number } = body;
        user = await User.findOne({ phone_number });
      }
      const result = await bcrypt.compare(body.password, user.password);
      if (!result) {
        res.status(400);
        throw new Error("Password is incorrect!");
      }
      const accessToken = jwt.sign(
        { user: { username: user.user_name, email: user.email } },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "15m",
        }
      );
      let oldTokens = user.tokens || [];
      if (oldTokens.length) {
        oldTokens = oldTokens.filter((token) => {
          const timeDiff = (Date.now() - parseInt(token.signedAt)) / 1000;
          if (timeDiff < 900) {
            return token;
          }
        });
      }
      await User.findByIdAndUpdate(user._id, {
        tokens: [
          ...oldTokens,
          { accessToken, signedAt: Date.now().toString() },
        ],
      });
      res.status(status.SUCCESS).json({
        statusCode: status.SUCCESS,
        accessToken,
        title: "Success",
        message: "User logged in successfully!",
      });
    }
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    if (users) {
      res.status(status.SUCCESS).json({
        statusCode: status.SUCCESS,
        title: "Success",
        message: "Users retrieve successfully!",
        data: users,
      });
    } else {
      res.status(500);
      throw new Error("Users not found!");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err.message);
  }
});

const logOutUser = asyncHandler(async (req, res) => {
  console.log("here not coomee=====>>>>>");
  try {
    const accessToken = req.headers.authorization;
    const tokens = req.user.tokens;
    const newTokens = tokens.filter((t) => {
      return t.accessToken !== accessToken;
    });
    await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
    res.status(status.SUCCESS).json({
      statusCode: status.SUCCESS,
      title: "Success",
      message: "LogOut successfully!",
    });
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

module.exports = { loginUser, registerUser, getUsers, logOutUser };
