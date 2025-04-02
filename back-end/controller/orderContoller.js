const catchAsyncError = require('../middleware/catchAsyncError');
const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/productModel');
//Create new Order
exports.newOrder = catchAsyncError(async (req,res,next)=>{
    const {
        orderItems,
        deliveryInfo,
        itemsPrice,
        deliveryCharge,
        totalPrice,
        paymentInfo
    } = req.body

    const order = await Order.create({
        orderItems,
        deliveryInfo,
        itemsPrice,
        deliveryCharge,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user.id
    });
    
    res.status(200).json({
        success:true,
        order
    });
});

//Get a single order
exports.getSingleOrder = catchAsyncError(async (req,res,next)=>{
   const order =  await Order.findById(req.params.id).populate('user','name email');
   if(!order){
     return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`,404));
   }

   res.status(200).json({
    success:true,
    order
   });
})

//Get logged in user order
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({user: req.user.id});

    res.status(200).json({
        success: true,
        orders
    })
});

//Admin: Gett All orders
exports.getAllOrders = catchAsyncError(async (req,res,next)=>{
    const orders = await Order.find();
    let totalamount = 0;

     orders.forEach(order => {
        totalamount += order.totalPrice
     });

    res.status(200).json({
        success:true,
        totalamount,
        orders
    });
})

//Admin: Update Order/ Order Status
exports.updateStatus = catchAsyncError(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(order.orderStatus == 'Delivered'){
        return next(new ErrorHandler("Order has been alredy delivered!",400));
    }

    //Updating the Product Stock of each order item
    order.orderItems.forEach(async orderItem => {
       await updateStock(orderItem.product,orderItem.quantity);
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success:true,
        
    })
});

async function updateStock(productId,quantity){
   const product = await Product.findById(productId);
   product.stock = product.stock - quantity;
   product.save({validateBeforeSave:false});
}

//Admin: Delete Order
exports.deleteOrder = catchAsyncError(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`));
    }

    await order.deleteOne();
    res.status(200).json({
        success:true
    });
})
