const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures')

// Get All Products
exports.getProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 2;

  const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);
  const products = await apiFeatures.query; // Execute the query

  res.status(200).json({
      success: true,
      count: products.length,
      products,
  });
});

// Get a Single Product
exports.getSingleProduct = catchAsyncError(async (req,res,next)=>{
  const product = await Product.findById(req.params.id);

  if(!product){
    return next(new ErrorHandler('Product not found',400));
  }

  res.status(200).json({
    success:true,
    product
  })
});

exports.newProduct = catchAsyncError(async(req,res,next)=>{
   req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
      success:true,
      product
    })
});

// Update a Product
exports.updateProduct = async (req,res,next)=>{
  let product = await Product.findById(req.params.id);
  if(!product){
   return res.status(404).json({
      success:false,
      message:"Product not found"
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new:true,
    runValidators:true
  });

  res.status(200).json({
    success:true,
    product
  });
}

// Delete a Product
exports.deleteProduct = async (req,res,next)=>{
  let product = await Product.findById(req.params.id);
  if(!product){
    return res.status(404).json({
      success:true,
      message:"Product not found"
    });
  }

  await product.deleteOne();
  res.status(200).json({
    success:true,
    message:"Product Deleted"
  });
}

