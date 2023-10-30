const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.CONNECTION_URL);
    console.log("Db Connected successfully!");
  } catch (error) {
    console.log("Error on Connection db:::", error);
  }
};

module.exports = connectDB;
