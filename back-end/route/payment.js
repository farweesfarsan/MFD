const express = require('express');
const { authenticatedUser } = require('../middleware/authMiddleware');
const { processPayment, notifyPayment, generateMd5sig } = require('../controller/paymentContoller');
const router = express.Router();


   router.route('/paymentProcess').post(processPayment);
   router.route('/notifyPayment').post(notifyPayment);

module.exports = router;