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
    discount: {
        type: Number,
        default: 0.0,
        required:true,
    },

    finalPrice: {
        type: Number,
        default:0.0,
        required:true
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

});

orderSchema.pre('save', async function (next) {
    try {
      const userId = this.user;
  
      const subscription = await mongoose.model('Subscription').findOne({ userId: userId });
  
      if (!subscription || !subscription.isActive) {
        this.discount = 0;
        this.finalPrice = this.totalPrice;
        return next();
      }
  
      let discountRate = 0;
      switch (subscription.planType) {
        case 'Silver':
          discountRate = 0.05;
          break;
        case 'Gold':
          discountRate = 0.10;
          break;
        case 'Premium':
          discountRate = 0.15;
          break;
        default:
          discountRate = 0;
      }
  
      this.discount = this.totalPrice * discountRate;
      this.finalPrice = this.totalPrice - this.discount;
  
      next();
    } catch (error) {
      next(error);
    }
  });
  

module.exports = mongoose.model('Order',orderSchema);

