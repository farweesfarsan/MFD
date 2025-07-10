const ErrorHandler = require('../utils/errorHandler');
const catchAssyncError = require('./catchAsyncError');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.authenticatedUser = catchAssyncError(async (req,res,next)=>{
    const { token } = req.cookies;
    if(!token){
       return next(new ErrorHandler('Please Login first to handle this Resource!',401));
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decode.id)
    next();
});

exports.authorizedRoles = (...roles)=>{
   return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(`Role ${req.user.role} not allowed`))
        }
        next();
    }
}