const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { status } = require("../../constants");

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
      const isUserExist = User.findOne({ email });
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

const loginUser = (req, res) => {
  const { body } = req;
  console.log("Body::", body);
  res.json("register user");
};

module.exports = { loginUser, registerUser };
