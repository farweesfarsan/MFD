const express = require('express');
const multer = require('multer');
const path = require('path');

const upload = multer({storage: multer.diskStorage({
     destination: function(req, file, cb){
        cb(null,path.join(__dirname,'..','uploads/products'))
     },
     filename: function(req,file,cb){
        cb(null,file.originalname)
     }
})})



const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAllProducts } = require('../controller/productController');
const router = express.Router();
const { authenticatedUser,authorizedRoles } = require('../middleware/authMiddleware');

router.route('/products').get(getProducts);
router.route('/products/:id').get(getSingleProduct);

router.route('/review').put(authenticatedUser,createReview);
router.route('/review').get(getReviews);
router.route('/review').delete(deleteReview);

// Admin route
router.route('/admin/products/new').post(authenticatedUser,authorizedRoles('admin'),upload.single('image'),newProduct);
router.route('/admin/getAllProducts').get(authenticatedUser,authorizedRoles('admin'),getAllProducts);
router.route('/admin/products/:id').delete(authenticatedUser,authorizedRoles('admin'),deleteProduct);
router.route('/admin/products/:id').put(authenticatedUser,authorizedRoles('admin'),upload.single('image'),updateProduct);

module.exports = router;