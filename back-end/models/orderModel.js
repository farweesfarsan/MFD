const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    deliveryInfo:{
        address:{
            type:String,
            required:true
        },

        city:{
            type:String,
            required:true,  
        },

        phoneNo:{
            type:String,
            required:true
        }
    },
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        required:true,
        ref:"User"
    },
    orderItems:[{
        name:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true

        },
        price:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        product:{
            type:mongoose.SchemaTypes.ObjectId,
            required:true,
            ref:"Product"
        }
    }],
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    deliveryCharge:{
        type:Number,
        required:true,
        default:0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },

    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    },
    paidAt:{
        type:Date
    },
    deliveredAt:{
        type:Date
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Order',orderSchema);
