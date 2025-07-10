// const mongoose = require('mongoose');
// const validator = require('validator');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const { type } = require('os');

// const deliveryStaffSchema = mongoose.Schema({
//     name:{
//         type:String,
//         required:[true,'Please enter name']
//     },
//     email:{
//         type:String,
//         required:[true,'Please enter email'],
//         unique:true,
//         validate: {
//             validator: validator.isEmail,
//             message: 'Please Enter a Valid Email Address'
//         }
//     },
//     nic:{
//         type:String,
//         required:[true,'Please Enter Your Valid NIC']
//     },
//     mobileNo:{
//         type:String,
//         required:[true,'Please Enter Your Mobile Number']
//     },
//     address:{
//         type:String,
//         required:[true,'Please Enter Your Current living address']
//     },
//     password:{
//         type:String,
//         required:[true,'Please Enter Password'],
//         maxleangth:[6,'Password Cannot exceed 6 charectors'],
//         select:false
//     },
//     avatar:{
//         type:String   
//     },
      
//     otp: String,
//     otpExpire: Date,
//     role:{
//         type:String,
//         default:'deliveryStaff'
//     },
    
//     resetPasswordToken: String,
//     resetPasswordExpireToken: Date,
//     createdAt:{
//         type:Date,
//         default:Date.now
//     },
    

// })

// deliveryStaffSchema.pre('save', async function (next){
//     if(!this.isModified('password')){
//         next();
//     }
//     this.password  = await bcrypt.hash(this.password, 10)
// })

// deliveryStaffSchema.methods.getJwtToken = function(){
//    return jwt.sign({id:this.id},process.env.JWT_SECRET,{
//         expiresIn:process.env.JWT_EXPIRES
//     })
// }

// deliveryStaffSchema.methods.isPasswordValid = async function(enteredPassword){
//    return bcrypt.compare(enteredPassword,this.password);
// }

// deliveryStaffSchema.methods.getResetToken = function(){
//     const token = crypto.randomBytes(20).toString('hex');
//     this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
//     this.resetPasswordExpireToken = Date.now() + 30 * 60 * 1000

//    return token;
// }

// deliveryStaffSchema.methods.generateOtp = function () {
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     this.otp = otp;
//     this.otpExpire = Date.now() + 10 * 60 * 1000;
//     return otp;
// };



// module.exports = mongoose.model('DeliveryStaff',deliveryStaffSchema);

// models/DeliveryStaff.js
const mongoose = require('mongoose');

const deliveryStaffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  nic: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('DeliveryStaff', deliveryStaffSchema);
