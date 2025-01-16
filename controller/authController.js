const catchAssyncError = require('../middleware/catchAsyncError');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const { getResetToken } = require('../models/userModel');

exports.registerUser = catchAssyncError( async (req,res,next)=>{
 const {name,email,password,avatar} = req.body;
 const hashedPassword = await bcrypt.hash(password,10);
 
 const user = await User.create({
    name,
    password:hashedPassword,
    email,
    avatar
  });

  sendToken(user,201,res);
});

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

exports.forgotPassword = catchAssyncError(async (req,res,next)=>{
  const user = await User.findOne({email:req.body.email});

  if(!user){
    next(new ErrorHandler("User not found with this email"));
  }
  
 const resetToken = user.getResetToken();
 user.save({validateBeforSave:false})

 //Create reset url
 const reseturl = `${req.protocol}://${req.get('host')}/user/password/reset/${resetToken}`
 const message = `Your password reset url is follo as \n\n
 ${reseturl} \n\n If you have not request this email,then ignore it.`

 try {
      

 } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireToken = undefined;
    await user.save({validateBeforSave:false});
    next(new ErrorHandler(error.message),500);
 }
  
})