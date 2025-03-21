const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures')

// Get All Products
exports.getProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 4;

  let buildQuery = () => {
      return new ApiFeatures(Product.find(), req.query).search().filter();
  };

  const totalProductsCounts = await Product.countDocuments();
  const filteredProductCount = await buildQuery().query.countDocuments();

  let productsCount = totalProductsCounts;
  if (filteredProductCount !== totalProductsCounts) {
      productsCount = filteredProductCount;
  }

  // Apply pagination properly
  let apiFeatures = buildQuery().paginate(resPerPage);
  const products = await apiFeatures.query;

  res.status(200).json({
      success: true,
      count: productsCount,
      resPerPage,
      products,
  });
});



// Get a Single Product
exports.getSingleProduct = catchAsyncError(async (req,res,next)=>{
  const product = await Product.findById(req.params.id);

  if(!product){
    return next(new ErrorHandler('Product not found',400));
  }
// await new Promise(resolve =>setTimeout(resolve,4000))
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

//Create Review
// exports.createReview = async (req,res,next)=>{
//   const { productId, rating, comment } = req.body;

//   const review = {
//     user : req.user.id,
//     rating: rating,
//     comment: comment
//   }

//   const product = await Product.findById(productId);
//   //finding user review existing
//   const isReviewed = product.reviews.find(reveiew => {
//     reveiew.user.toString() == req.user.id.toString()
//   });

//   if(isReviewed){
//      product.reviews.forEach(review =>{
//       if(review.user.toString() == req.user.id.toString()){
//         review.comment = comment
//         review.rating = rating
//       }
//      })
//   }else{
//     //creating the review
//     product.reviews.push(review);
//     product.numOfReviews = product.reviews.length;
//   }
//   // find the average products of reviews
//   product.ratings = product.reviews.reduce((acc,review)=>{
//     return review.rating + acc;
//   },0)/product.ratings.length;
//   product.ratings = isNaN(product.ratings)?0:product.ratings;

//   await product.save({validateBeforeSave:false});

//   res.status(200).json({
//     success:true
//   })
// }
exports.createReview = catchAsyncError(async (req, res, next) =>{
  const  { productId, rating, comment } = req.body;

  const review = {
      user : req.user.id,
      rating,
      comment
  }

  const product = await Product.findById(productId);
 //finding user review exists
  const isReviewed = product.reviews.find(review => {
     return review.user.toString() == req.user.id.toString()
  })

  if(isReviewed){
      //updating the  review
      product.reviews.forEach(review => {
          if(review.user.toString() == req.user.id.toString()){
              review.comment = comment
              review.rating = rating
          }

      })

  }else{
      //creating the review
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
  }
  //find the average of the product reviews
  product.ratings = product.reviews.reduce((acc, review) => {
      return review.rating + acc;
  }, 0) / product.reviews.length;
  product.ratings = isNaN(product.ratings)?0:product.ratings;

  await product.save({validateBeforeSave: false});

  res.status(200).json({
      success: true
  })


})

//Get reviews => mfd/review?id={productId}
exports.getReviews = catchAsyncError(async (req,res,next)=>{
   const product = await Product.findById(req.query.id);

   res.status(200).json({
    success:true,
    reviews:product.reviews
   })
})

//Delete reviews 
exports.deleteReview = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    //filtering the reviews which does match the deleting review id
    const reviews = product.reviews.filter(review =>{
      return review._id.toString() !== req.query.id.toString();
    })

    // number of reviews
    const numOfReviews = reviews.length;
    //finding the average with the filtered reviews
    let ratings = product.reviews.reduce((acc,review) =>{
      return review.rating + acc;
    },0) / reviews.length;
    ratings = isNaN(ratings)?0:ratings;
    await Product.findByIdAndUpdate(req.query.productId,{
      reviews,
      numOfReviews,
      ratings
    })
    res.status(200).json({
      success:true
    })
})

