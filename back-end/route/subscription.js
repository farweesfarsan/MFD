const express = require('express');
const { authenticatedUser } = require('../middleware/authMiddleware');
const {createSubscription} = require('../controller/subscriptionController');
const { subscriptionNotify } = require('../controller/subscriptionController');
const { getSubscriptionDetailsById } = require('../controller/subscriptionController');


const router = express.Router();
router.route('/subscription/create').post(authenticatedUser,createSubscription);
router.route('/subscription-notify').post(authenticatedUser,subscriptionNotify);
router.route('/getSubscriptionDetails').post(authenticatedUser,getSubscriptionDetailsById);


module.exports = router;