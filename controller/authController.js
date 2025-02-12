const catchAssyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');

const sendEmail = require('../utils/emailServer');
const { response } = require('express');

// Register user - http://localhost:8000/user/register
exports.registerUser = catchAssyncError( async (req,res,next)=>{
 const {name,email,password,avatar} = req.body;
 
 const user = await User.create({
    name,
    password,
    email,
    avatar
  });

  sendToken(user,201,res);
});

// Login an existing user - http://localhost:8000/user/userLogin
exports.loginUser = catchAssyncError(async (req, res, next) => {
  const {email, password} =  req.body

  if(!email || !password) {
      return next(new ErrorHandler('Please enter email & password', 400))
  }

  //finding the user database
  const user = await User.findOne({email}).select('+password');

  if(!user) {
      return next(new ErrorHandler('Invalid email or password', 401))
  }
  
  if(!await user.isPasswordValid(password)){
      return next(new ErrorHandler('Invalid email or password', 401))
  }

  sendToken(user, 201, res)
  
})

// Logout an existing User - http://localhost:8000/user/userLogout
exports.logoutUser = (req,res,next)=>{
  res.cookie('token',null,{
    expires:new Date(Date.now()),
    httpOnly:true
  })
   .status(200)
   .json({
     success:true,
     message:"Logout User"
   });
}

// Forgot Password - http://localhost:8000/user/password/forgot
exports.forgotPassword = catchAssyncError(async (req,res,next)=>{
  const user = await User.findOne({email:req.body.email});

  if(!user){
    next(new ErrorHandler("User not found with this email"));
  }
  
//  const resetToken = user.getResetToken();
     const resetToken = user.getResetToken();
 user.save({validateBeforSave:false})

 //Create reset url
 const reseturl = `${req.protocol}://${req.get('host')}/user/password/reset/${resetToken}`
 const message = `Your password reset url is follow as \n\n
 ${reseturl} \n\n If you have not request this email,then ignore it.`

 try {
     await sendEmail({
      email:user.email,
      subject:"MFD Password Recovery",
      message
     });

     res.status(200).json({
      success:true,
      message:`Email sent to ${user.email}`
     })

 } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireToken = undefined;
    await user.save({validateBeforSave:false});
    next(new ErrorHandler(error.message),500);
 }
  
});

// Reset the Password - http://localhost:8000/user/password/reset/:token
exports.resetPassword = catchAssyncError(async (req,res,next)=>{
   const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
   const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpireToken:{
      $gt:Date.now()
    }
   })

   if(!user){
    return next(new ErrorHandler("Password Reset token is invalid or expired"));
   }

   if(req.body.password !== req.body.confirmedPassword){
      next(new ErrorHandler("Password does not matched!"))
   }
    
   user.password = req.body.password;
   user.resetPasswordToken = undefined;
   user.resetPasswordExpireToken = undefined;

   await user.save({validateBeforeSave: false});
   sendToken(user,201,res);


});

//Get User Profile
exports.getUserProfile = catchAssyncError(async (req,res,next)=>{
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success:true,
    user
  });
})

//Change Password
exports.changePassword = catchAssyncError(async (req,res,next)=>{
  const user = await User.findById(req.user.id).select('+password');

  //check the old password
  if(!await user.isPasswordValid(req.body.oldPassword)){
    return next(new ErrorHandler("Old Password is incorrect"));
  }

  //assigning new password
  user.password = req.body.password;
  await user.save();
  res.status(201).json({
    success:true,
  })
})