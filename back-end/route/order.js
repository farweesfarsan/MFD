const express = require('express');
const { newOrder, getSingleOrder, myOrders,getAllOrders,updateStatus, deleteOrder, cancelOrder } = require('../controller/orderContoller');
const { authenticatedUser,authorizedRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/newOrder').post(authenticatedUser,newOrder);
router.route('/order/:id').get(authenticatedUser,getSingleOrder);
router.route('/myOrders').get(authenticatedUser,myOrders);
router.route('/cancelOrder/:id').put(authenticatedUser,cancelOrder);

//Admin route
router.route('/admin/getAllOrders').get(authenticatedUser,authorizedRoles('admin'),getAllOrders);
router.route('/admin/:id').put(authenticatedUser,authorizedRoles('admin'),updateStatus);
router.route('/admin/:id').delete(authenticatedUser,authorizedRoles('admin'),deleteOrder);
module.exports = router;