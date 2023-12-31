const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email should be unique"],
  },
  phone_number: {
    type: Number,
    required: [true, "phone is required"],
    unique: [true, "Phone Number should be unique"],
  },
  full_name: { type: String, required: [true, "Full Name is required"] },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  dob: { type: Date },
  user_name: { type: String },
  gender: { type: String },
  tokens: [{ type: Object }],
});

module.exports = mongoose.model("User", UserSchema);
