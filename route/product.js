const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controller/productController');
const router = express.Router();
const { authenticatedUser,authorizedRoles } = require('../middleware/authMiddleware');

router.route('/products').get(authenticatedUser,getProducts);
router.route('/products/new').post(authenticatedUser,authorizedRoles('admin'),newProduct);
router.route('/products/:id').get(getSingleProduct);
router.route('/products/:id').put(updateProduct);
router.route('/products/:id').delete(deleteProduct);

module.exports = router;