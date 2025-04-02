const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controller/productController');
const router = express.Router();
const { authenticatedUser,authorizedRoles } = require('../middleware/authMiddleware');

router.route('/products').get(getProducts);
router.route('/products/:id').get(getSingleProduct);
router.route('/products/:id').put(updateProduct);
router.route('/products/:id').delete(deleteProduct);

router.route('/review').put(authenticatedUser,createReview);
router.route('/review').get(getReviews);
router.route('/review').delete(deleteReview);

// Admin route
router.route('/admin/products/new').post(authenticatedUser,authorizedRoles('admin'),newProduct);

module.exports = router;