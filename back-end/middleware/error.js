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
module.exports = (err, req, res, next) => {
  // Ensure a default statusCode
  err.statusCode = err.statusCode || err.statuscode || 500;

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // PRODUCTION
  // Clone error object to modify safely
  let error = { ...err };
  error.message = err.message;

  // Handle known errors
  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors).map(value => value.message).join(", ");
    error.statusCode = 400;
  }

  if (err.name === 'CastError') {
    error.message = `Resource not found: ${err.path}`;
    error.statusCode = 400;
  }

  if (err.code === 11000) {
    error.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    error.statusCode = 400;
  }

  if (err.name === 'JSONWebTokenError') {
    error.message = `Invalid JSON Web Token`;
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = `JSON Web Token has expired`;
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
};



