module.exports = (err, req, res, next) =>{
  err.statusCode  = err.statusCode || 500;


  if(process.env.NODE_ENV == 'development'){
      res.status(err.statusCode).json({
          success: false,
          message: err.message,
          stack: err.stack,
          error: err
      })
  }

  if(process.env.NODE_ENV == 'production'){
      let message = err.message;
      let error = new Error(message);
     

      if(err.name == "ValidationError") {
          message = Object.values(err.errors).map(value => value.message)
          error = new Error(message)
          err.statusCode = 400
      }

      if(err.name == 'CastError'){
          message = `Resource not found: ${err.path}` ;
          error = new Error(message)
          err.statusCode = 400
      }

      if(err.code == 11000) {
          let message = `Duplicate ${Object.keys(err.keyValue)} error`;
          error = new Error(message)
          err.statusCode = 400
      }

      if(err.name == 'JSONWebTokenError') {
          let message = `JSON Web Token is invalid. Try again`;
          error = new Error(message)
          err.statusCode = 400
      }

      if(err.name == 'TokenExpiredError') {
          let message = `JSON Web Token is expired. Try again`;
          error = new Error(message)
          err.statusCode = 400
      }

      res.status(err.statusCode).json({
          success: false,
          message: error.message || 'Internal Server Error',
      })
  }
}







// const ErrorHandler = require("../utils/errorHandler");

// module.exports = (err, req, res, next) => {
//   // Set default status code if not already provided
//   err.statuscode = err.statuscode || 500;

//   if (process.env.NODE_ENV === 'development') {
//     res.status(err.statuscode).json({
//       success: false,
//       message: err.message,
//       stack: err.stack,
//       error: err,
//     });
//   }

//   if (process.env.NODE_ENV === 'production') {
//     let message = err.message; // Default error message
//     let error = new Error(message);

//     if (err.name === "ValidationError") {
//       // Extract only the first validation error message
//       const firstError = Object.values(err.errors)[0];
//       message = firstError.message; // Get the message of the first validation error
//       error = new ErrorHandler(message, 400); // Create a new error instance with the first message
//       err.statuscode = 400
//     }

//     if (err.name === 'CastError') {
//       message = `Resource not found for field ${err.path}`;
//       error = new ErrorHandler(message, 404); // Use ErrorHandler with a 404 status code
//     }

//     if(err.code == 11000){
//       let message = `This ${Object.keys(err.keyValue)} already exist`;
//       error = new ErrorHandler(message, 400);
//     }

//     if(err.name == 'JSONWebTokenError'){
//       let message = 'Json WebToken is Invalid.Try again'
//       error = new ErrorHandler(message, 400);
//     }

//     if(err.name == 'TokenExpiredError'){
//       let message = 'Json WebToken is Expired.Try again'
//       error = new ErrorHandler(message, 400);
//     }

//     res.status(error.statuscode || 500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };

// module.exports = (err, req, res, next) =>{
//   err.statusCode  = err.statusCode || 500;


//   if(process.env.NODE_ENV == 'development'){
//       res.status(err.statusCode).json({
//           success: false,
//           message: err.message,
//           stack: err.stack,
//           error: err
//       })
//   }

//   if(process.env.NODE_ENV == 'production'){
//       let message = err.message;
//       let error = new Error(message);
     

//       if(err.name == "ValidationError") {
//           message = Object.values(err.errors).map(value => value.message)
//           error = new Error(message)
//           err.statusCode = 400
//       }

//       if(err.name == 'CastError'){
//           message = `Resource not found: ${err.path}` ;
//           error = new Error(message)
//           err.statusCode = 400
//       }

//       if(err.code == 11000) {
//           let message = `Duplicate ${Object.keys(err.keyValue)} error`;
//           error = new Error(message)
//           err.statusCode = 400
//       }

//       if(err.name == 'JSONWebTokenError') {
//           let message = `JSON Web Token is invalid. Try again`;
//           error = new Error(message)
//           err.statusCode = 400
//       }

//       if(err.name == 'TokenExpiredError') {
//           let message = `JSON Web Token is expired. Try again`;
//           error = new Error(message)
//           err.statusCode = 400
//       }

//       res.status(err.statusCode).json({
//           success: false,
//           message: error.message || 'Internal Server Error',
//       })
//   }
// }
