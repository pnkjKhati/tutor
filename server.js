const express = require("express");
const connectDB = require("./src/utils/dbConnection");
const errorHandler = require("./src/middlewares/errorhandler");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

connectDB();
app.use(express.json());
app.use("/api/user", require("./src/routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
