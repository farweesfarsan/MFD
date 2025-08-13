const express = require('express');
const { newOrder, getSingleOrder, myOrders,getAllOrders,updateStatus, deleteOrder, cancelOrder, getOrdersById, getAllOrdersForDeliveryStaff, fetchDeliveryStaffDeliveredOrders} = require('../controller/orderContoller');
const { authenticatedUser,authorizedRoles } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/newOrder').post(authenticatedUser,newOrder);
router.route('/order/:id').get(authenticatedUser,getSingleOrder);
router.route('/myOrders').get(authenticatedUser,myOrders);
router.route('/cancelOrder/:id').put(authenticatedUser,cancelOrder);
//router.route('/getrouterOrders/:id').get(authenticatedUser,getOrdersById);
router.route('/getOrder').get(authenticatedUser,getOrdersById);
router.route('/fetchDeliveryStaffOrder').get(authenticatedUser,fetchDeliveryStaffDeliveredOrders);
router.route('/delliveryStaff/orders/:id').get(authenticatedUser,authorizedRoles('DeliveryStaff'),getAllOrdersForDeliveryStaff);


//Admin route
router.route('/admin/getAllOrders').get(authenticatedUser,authorizedRoles('Admin','Super_Admin'),getAllOrders);
router.route('/admin/:id').put(authenticatedUser,authorizedRoles('Admin','DeliveryStaff','Super_Admin'),updateStatus);
router.route('/admin/:id').delete(authenticatedUser,authorizedRoles('Admin','Super_Admin'),deleteOrder);
module.exports = router;