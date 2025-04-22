const express = require('express');
const { authenticatedUser } = require('../middleware/authMiddleware');
// const { processPayment, sendStripeApi } = require('../controller/paymentContoller');
const { processPayment, notifyPayment, generateMd5sig } = require('../controller/paymentContoller');
const router = express.Router();

// router.route('/payment/process').post(authenticatedUser,processPayment);
// router.route('/stripeApi').get(authenticatedUser,sendStripeApi);
   router.route('/paymentProcess').post(processPayment);
   // router.route('/generateMd5').post(authenticatedUser,generateMd5sig);
   router.route('/notifyPayment').post(notifyPayment);

module.exports = router;