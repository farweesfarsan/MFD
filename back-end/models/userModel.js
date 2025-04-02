const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { type } = require('os');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please enter name']
    },
    email:{
        type:String,
        required:[true,'Please enter email'],
        unique:true,
        validate: {
            validator: validator.isEmail,
            message: 'Please Enter a Valid Email Address'
        }

    },
    password:{
        type:String,
        required:[true,'Please Enter Password'],
        maxleangth:[6,'Password Cannot exceed 6 charectors'],
        select:false
    },
    avatar:{
        type:String   
    },
    otp: String,
    otpExpire: Date,
    role:{
        type:String,
        default:'user'
    },
    
    resetPasswordToken: String,
    resetPasswordExpireToken: Date,
    createdAt:{
        type:Date,
        default:Date.now
    }

})

userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        next();
    }
    this.password  = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function(){
   return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES
    })
}

userSchema.methods.isPasswordValid = async function(enteredPassword){
   return bcrypt.compare(enteredPassword,this.password);
}

userSchema.methods.getResetToken = function(){
    //Generate token
    const token = crypto.randomBytes(20).toString('hex');

    //Generate Hash to this resetPasswordToken
   this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

   //Set token expires time
   this.resetPasswordExpireToken = Date.now() + 30 * 60 * 1000

   return token;
}

userSchema.methods.generateOtp = function () {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit OTP
    this.otp = otp;
    this.otpExpire = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    return otp;
};



module.exports = mongoose.model('User',userSchema);