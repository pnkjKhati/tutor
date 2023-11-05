const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuth = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401);
      throw new Error("access token is required!");
    }
    const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    const user = await User.findOne({ email: verify.user.email }, "-password");
    const isTokenAvailable = user.tokens.find((t) => t.accessToken === token);
    if (verify.exp > currentTimeStamp && isTokenAvailable) {
      req.user = user;
    } else {
      res.status(401);
      throw new Error("Token expired!");
    }
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }

  next();
});

module.exports = isAuth;
