const catchAssyncError = require("../middleware/catchAsyncError");


const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/emailServer");
const { response } = require("express");
const forgotPasswordTemplate = require("../emailTemplates/forgotPasswordTemplate");
const otpEmailTemplate = require("../emailTemplates/otpEmailTemplate");

const User = require('../models/userModel');

const DeliveryStaff = require('../models/deliveryStaff');
const bcrypt = require("bcrypt");
const { liveStaffMap } = require('../ws/websocketManager');


exports.createDeliveryStaff = catchAssyncError(async (req, res) => {
  try {
    const { name, email, password, nic, address, mobileNo } = req.body;

    if (!name || !email || !password || !nic || !address || !mobileNo) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const existingNIC = await DeliveryStaff.findOne({ nic });
    if (existingNIC) {
      return res.status(400).json({ message: 'NIC already exists' });
    }

    let avatar;
    if (req.file) {
      avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
    }


    const user = new User({
      name,
      email,
      password,
      avatar,
      role: 'DeliveryStaff',
    });

    const savedUser = await user.save();

    const deliveryStaff = new DeliveryStaff({
      userId: savedUser._id,
      nic,
      address,
      mobileNo,
    });

    let savedStaff;
    try {
      savedStaff = await deliveryStaff.save();
    } catch (e) {
      console.error("DeliveryStaff Save Error:", e);
      return res.status(500).json({ message: "Error saving delivery staff", error: e.message });
    }

    res.status(201).json({ message: 'Delivery staff registered', user: savedUser, deliveryStaff: savedStaff });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

exports.getDeliveryStaff = catchAssyncError(async (req,res)=>{
  try {
      const staff = await User.findById(req.params.id);
      if(!staff){
        return res.status(404).json({message: "Delivery Staff not found"});
      }

      res.json({
        name:staff.name,
        email:staff.email,

      })
  } catch (error) {
     console.error('Error fetching delivery staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
})
