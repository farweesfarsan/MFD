const catchAsyncError = require('../middleware/catchAsyncError');
const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const getCoordinatesFromAddress = require('../utils/geocode');
const getDistance = require('../utils/harvesine');
const { liveStaffMap } = require('../ws/websocketManager');
const { notifyDeliveryStaff } = require('../socket/socketHandler')

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    deliveryInfo,
    itemsPrice,
    deliveryCharge,
    totalPrice,
    paymentInfo,
  } = req.body;

 const verificationCode = Math.floor(1000 + Math.random() * 9000); // generates 1000 - 9999


  const order = await Order.create({
    orderItems,
    deliveryInfo,
    itemsPrice,
    deliveryCharge,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
    verificationCode,
    orderStatus: paymentInfo.status === "Paid" ? "Processing" : "Pending",
  });

  res.status(200).json({
    success: true,
    order,
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

exports.updateStatus = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    const user = await User.findById({user: req.user._id});

    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler("Order has already been delivered!", 400));
    }

    order.orderStatus = req.body.orderStatus;

    if (req.body.orderStatus === 'Delivered') {
        order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        user
    });
});


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


exports.cancelOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found!", 404));
  }

  if (order.user.toString() !== req.user.id) {
    return next(
      new ErrorHandler("You are not authorized to handle this order!", 403)
    );
  }

  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("Cannot cancel this order, it has already been delivered!", 400)
    );
  }

  if (order.orderStatus === "Dispatched") {
    return next(
      new ErrorHandler("Cannot cancel this order, products are dispatched!", 400)
    );
  }

  if (order.orderStatus === "Cancelled") {
    return next(new ErrorHandler("This order is already cancelled!", 400));
  }

  const { reason } = req.body;

  if (!reason || reason.trim().length < 5) {
    return next(new ErrorHandler("Cancellation reason is required!", 400));
  }

  order.orderStatus = "Cancelled";
  order.cancelledAt = Date.now();
  order.cancellationReason = reason;

  // Restore product stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save({ validateBeforeSave: false });
    }
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    order,
  });
});


// controller/orderController.js
exports.getOrdersById = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId });
  const totalOrders = orders.length;

  if (!orders || orders.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No orders found for this user',
    });
  }

  res.status(200).json({
    success: true,
    totalOrders,
    orders,

  });
});

exports.getAllOrdersForDeliveryStaff = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find(); // newest first
  res.status(200).json({
    success: true,
    orders,
  });
});

exports.fetchDeliveryStaffDeliveredOrders = catchAsyncError(async (req,res,next) => {
  const userId = req.user._id;
  const orders = await Order.find({user: userId});
  if (orders.orderStatus == "Delivered"){
     res.status(200).json({
      orders
     })
  }
})
