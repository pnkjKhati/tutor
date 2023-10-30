const { status } = require("../../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode || 404;
  console.log(err, res.statusCode);
  switch (statusCode) {
    case status.VALIDATION_ERROR:
      res.json({
        statusCode,
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case status.AUTHENTICATION_ERROR:
      res.json({
        statusCode,
        title: "Unauthrized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case status.FORBIDDEN:
      res.json({
        statusCode,
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case status.SERVER_ERROR:
      res.json({
        statusCode,
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case status.NOT_FOUND:
      res.json({
        statusCode,
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      console.log("No Error All good!");
      break;
  }
};

module.exports = errorHandler;
