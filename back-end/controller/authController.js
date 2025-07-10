const catchAssyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailServer");
const { response } = require("express");
const forgotPasswordTemplate = require("../emailTemplates/forgotPasswordTemplate");
const otpEmailTemplate = require("../emailTemplates/otpEmailTemplate");
const DeliveryStaff = require('../models/deliveryStaff');

// Register user - http://localhost:8000/user/register
exports.registerUser = catchAssyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  let avatar;
  if (req.file) {
    avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
  }

  const user = await User.create({
    name,
    password,
    email,
    avatar,
    role:'Customer'
  });

  sendToken(user, 201, res);
});

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    // Check if the user already exists
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists. Please log in.",
        });
    }

    // Generate a new OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000);
    const otpExpires = Date.now() + 6 * 60 * 1000; // OTP expires in 10 minutes

    // Generate email content
    const emailContent = otpEmailTemplate(generatedOtp, email);

    // Send OTP Email
    await sendEmail({
      email,
      subject: "Your OTP Code",
      html: emailContent,
    });

    // Send response with OTP (without saving in DB)
    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to proceed.",
      otp: generatedOtp, // Sending OTP in response
      otpExpireDate: otpExpires,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, clientOtp } = req.body;

    if (!email || !clientOtp || !otpExpires) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email, OTP, and expiration time are required.",
        });
    }

    console.log("Entered OTP:", clientOtp);
    console.log("Stored Expiry:", otpExpires, "Current Time:", Date.now());

    // Check if OTP is valid and not expired
    if (parseInt(clientOtp) !== parseInt(otp) || Date.now() > otpExpires) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to verify OTP. Please try again later.",
      });
  }
};

// Login an existing user - http://localhost:8000/user/userLogin
exports.loginUser = catchAssyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  //finding the user database
  // const user = await User.findOne({ email }).select("+password");
   const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  if (!(await user.isPasswordValid(password))) {
    return next(new ErrorHandler("Invalid password", 401));
  }

  sendToken(user, 201, res);
});

// Logout an existing User - http://localhost:8000/user/userLogout
exports.logoutUser = (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "Logout User",
    });
};

exports.forgotPassword = catchAssyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email",404));
  }

  // Generate reset token
  const resetToken = user.getResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  // Generate email template using forgotPasswordTemplate function
  const emailContent = forgotPasswordTemplate(resetUrl, user.name);

  try {
    await sendEmail({
      email: user.email,
      subject: "MFD Password Recovery",
      html: emailContent,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpireToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset the Password - http://localhost:8000/user/password/reset/:token
exports.resetPassword = catchAssyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpireToken: {
      $gt: Date.now(),
    },
  });

  // if (!user) {
  //   return next(new ErrorHandler("Password Reset token is invalid or expired"));
  // }

  // if (req.body.password !== req.body.confirmedPassword) {
  //   next(new ErrorHandler("Password does not matched!"));
  // }

  if (!user) {
  return next(new ErrorHandler("Password Reset token is invalid or expired"));
}

if (req.body.password !== req.body.confirmedPassword) {
  return next(new ErrorHandler("Password does not matched!"));
}

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpireToken = undefined;

  await user.save({ validateBeforeSave: false });
  sendToken(user, 201, res);
});

//Get User Profile
exports.getUserProfile = catchAssyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

//Change Password
exports.changePassword = catchAssyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //check the old password
  if (!(await user.isPasswordValid(req.body.oldPassword))) {
    return next(new ErrorHandler("Old Password is incorrect"));
  }

  //assigning new password
  user.password = req.body.password;
  await user.save();
  res.status(201).json({
    success: true,
  });
});

//update the profile
exports.updateProfile = catchAssyncError(async (req, res, next) => {
  let newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  let avatar;
  if (req.file) {
    avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
    newUserData = { ...newUserData, avatar };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//Admin: Get all users
exports.getAllUsers = catchAssyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//Admin: Get user by id
// exports.getUserById = catchAssyncError(async (req, res, next) => {
//   const user = await User.findById(req.params.id);
//   if (!user) {
//     return next(
//       new ErrorHandler(`User not found with this id: ${req.params.id}`)
//     );
//   }

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });
exports.getUserById = catchAssyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id: ${req.params.id}`)
    );
  }

  let deliveryStaffInfo = {};

  if (user.role === "DeliveryStaff") {
    const deliveryStaff = await DeliveryStaff.findOne({ userId: req.params.id });

    if (deliveryStaff) {
      deliveryStaffInfo = {
        nic: deliveryStaff.nic,
        mobileNo: deliveryStaff.mobileNo,
        address: deliveryStaff.address,
      };
    } else {
      return next(new ErrorHandler("Delivery staff info not found", 404));
    }
  }

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...deliveryStaffInfo,
    },
  });
});


//Admin: Update User
// exports.updateUser = catchAssyncError(async (req, res, next) => {
//   let newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//     role: req.body.role,
//   };

//   const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

exports.updateUser = catchAssyncError(async (req, res, next) => {
  const userId = req.params.id;

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  // Update user base data
  const user = await User.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
  });

  // Update deliveryStaff info if role is deliveryStaff
  if (req.body.role === "DeliveryStaff") {
    const deliveryData = {
      nic: req.body.nic,
      mobile: req.body.mobile,
      address: req.body.address,
    };

    // assuming user has a relatedId to DeliveryStaff schema
    await DeliveryStaff.findOneAndUpdate(
      { user: userId },  // or use user.relatedId if mapped that way
      deliveryData,
      { new: true, runValidators: true }
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});




//Admin: Delete a User
exports.deleteUser = catchAssyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with this id: ${req.params.id}`)
    );
  }

  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully!",
  });

  

});
