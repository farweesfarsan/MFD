const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  // Set default status code if not already provided
  err.statuscode = err.statuscode || 500;

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statuscode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  if (process.env.NODE_ENV === 'production') {
    let message = err.message; // Default error message
    let error = new Error(message);

    if (err.name === "ValidationError") {
      // Extract only the first validation error message
      const firstError = Object.values(err.errors)[0];
      message = firstError.message; // Get the message of the first validation error
      error = new ErrorHandler(message, 400); // Create a new error instance with the first message
    }

    if (err.name === 'CastError') {
      message = `Resource not found for field ${err.path}`;
      error = new ErrorHandler(message, 404); // Use ErrorHandler with a 404 status code
    }

    res.status(error.statuscode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
