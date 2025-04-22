// const axios = require('axios');
// const catchAsyncError = require('../middleware/catchAsyncError');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// // exports.processPayment = catchAsyncError(async(req,res,next)=> {
// //    const paymentIntent = await stripe.paymentIntents.create({
// //        amount: req.body.amount,
// //        currency: "lkr",
// //        description:"Order Payment",
// //     //    metadata: { integration_check: "access_payment"},
// //     //    delivery: req.body.delivery
// //     metadata: {
// //         integration_check: "access_payment",
// //         deliveryInfo: JSON.stringify(req.body.delivery) 
// //      }
// //    }) 

// //    res.status(200).json({
// //      success: true,
// //      client_secret: paymentIntent.client_secret
// //    })
// // })

// exports.processPayment = catchAsyncError(async (req, res, next) => {
//   const amountInLKR = req.body.amount;

//   // Example: Use exchangerate-api or other provider here
//   const exchangeRateResponse = await axios.get(
//     `https://v6.exchangerate-api.com/v6/6ac1bfca2073ec2b7000edca/latest/USD`
//   );
//   const lkrToUsdRate = exchangeRateResponse.data.conversion_rates.USD;
//   console.log("lkr rate",lkrToUsdRate);

//   // Convert LKR to USD and round to smallest currency unit (cents)
//   const amountInUSD = Math.round((amountInLKR * lkrToUsdRate) * 100); // Stripe uses cents
//   console.log("usd amount",amountInUSD);

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: amountInUSD,
//     currency: "usd", // Always use supported currency
//     description: "Order Payment",
//     metadata: {
//       integration_check: "access_payment",
//       deliveryInfo: JSON.stringify(req.body.delivery),
//       originalAmountLKR: amountInLKR.toString()
//     }
//   });

//   res.status(200).json({
//     success: true,
//     client_secret: paymentIntent.client_secret
//   });
// });


// exports.sendStripeApi = catchAsyncError(async(req,res,next)=>{
//     res.status(200).json({
//         stripeApiKey: paymentIntent.process.env.STRIPE_API_KEY
//     })
// })
// exports.processPayment = catchAsyncError(async (req,res)=>{

//   const merchant_id = process.env.MERCHANT_ID;
//   const merchant_secret = process.env.MERCHANT_SECRET;

//   const { order_id, amount, currency } = req.body;
//   const hash = crypto
//     .createHash("md5")
//     .update(
//       merchant_id +
//         order_id +
//         amount +
//         currency +
//         crypto
//           .createHash("md5")
//           .update(merchant_secret)
//           .digest("hex")
//           .toUpperCase()
//     )
//     .digest("hex")
//     .toUpperCase();

//     console.log("Hash generated for order:", order_id);
    

//   res.json({ hash, merchant_id });

// })

// const crypto = require('crypto');
// const catchAsyncError = require('../middleware/catchAsyncError');

// exports.processPayment = catchAsyncError(async (req, res) => {
//   const merchant_id = process.env.MERCHANT_ID;
//   const merchant_secret = process.env.MERCHANT_SECRET;
//   const { order_id, amount, currency } = req.body;

//   if (!merchant_id || !merchant_secret) {
//     return res.status(500).json({ error: "Missing merchant credentials." });
//   }

//   if (!order_id || !amount || !currency) {
//     return res.status(400).json({ error: "Missing required payment fields." });
//   }

//   const hashedSecret = crypto
//     .createHash("md5")
//     .update(merchant_secret)
//     .digest("hex")
//     .toUpperCase();

//   const hash = crypto
//     .createHash("md5")
//     .update(merchant_id + order_id + amount + currency + hashedSecret)
//     .digest("hex")
//     .toUpperCase();

//   console.log("✅ Hash generated for order:", order_id);

//   res.status(200).json({
//     hash,
//     merchant_id,
//     order_id,
//     amount,
//     currency,
//   });
// });

// exports.notifyPayment = catchAsyncError(async (req, res) => {
//   const merchant_secret = process.env.MERCHANT_SECRET;
//   const {
//     merchant_id,
//     order_id,
//     payhere_amount,
//     payhere_currency,
//     status_code,
//     md5sig,
//   } = req.body;

//   if (
//     !merchant_id ||
//     !order_id ||
//     !payhere_amount ||
//     !payhere_currency ||
//     !status_code ||
//     !md5sig
//   ) {
//     return res.status(400).json({ error: "Missing required fields in notification." });
//   }

//   const hashedSecret = crypto
//     .createHash("md5")
//     .update(merchant_secret)
//     .digest("hex")
//     .toUpperCase();

//   const local_md5sig = crypto
//     .createHash("md5")
//     .update(
//       merchant_id +
//       order_id +
//       payhere_amount +
//       payhere_currency +
//       status_code +
//       hashedSecret
//     )
//     .digest("hex")
//     .toUpperCase();

//   console.log("\n📥 Payment Notification Received:");
//   console.log("Order ID:", order_id);
//   console.log("Provided md5sig:", md5sig);
//   console.log("Generated local_md5sig:", local_md5sig);

//   if (local_md5sig === md5sig && status_code === "2") {
//     console.log("✅ Payment verified and successful for order:", order_id);

//     // TODO: Update payment status in your DB here

//     res.sendStatus(200);
//   } else {
//     console.log("❌ Payment verification failed for order:", order_id);
//     res.sendStatus(400);
//   }
// });

// exports.generateMd5sig = catchAsyncError(async (req, res) => {
//   const {
//     merchant_id,
//     order_id,
//     payhere_amount,
//     payhere_currency,
//     status_code,
//   } = req.body;

//   const merchant_secret = process.env.MERCHANT_SECRET;

//   if (
//     !merchant_id ||
//     !order_id ||
//     !payhere_amount ||
//     !payhere_currency ||
//     !status_code
//   ) {
//     return res.status(400).json({ error: "Missing required fields to generate md5sig." });
//   }

//   const hashedSecret = crypto
//     .createHash("md5")
//     .update(merchant_secret)
//     .digest("hex")
//     .toUpperCase();

//   const rawString =
//     merchant_id +
//     order_id +
//     payhere_amount +
//     payhere_currency +
//     status_code +
//     hashedSecret;

//   const md5sig = crypto
//     .createHash("md5")
//     .update(rawString)
//     .digest("hex")
//     .toUpperCase();

//   res.status(200).json({ md5sig });
// });

// exports.notifyPayment = catchAsyncError(async (req,res)=>{
  
//   const merchant_secret = process.env.MERCHANT_SECRET;


//   const {
//     merchant_id,
//     order_id,
//     payhere_amount,
//     payhere_currency,
//     status_code,
//     md5sig,
//   } = req.body;

//   const local_md5sig = crypto
//     .createHash("md5")
//     .update(
//       merchant_id +
//         order_id +
//         payhere_amount +
//         payhere_currency +
//         status_code +
//         crypto
//           .createHash("md5")
//           .update(merchant_secret)
//           .digest("hex")
//           .toUpperCase()
//     )
//     .digest("hex")
//     .toUpperCase();

//     console.log("Payment notification for order:", order_id);


//   if (local_md5sig === md5sig && status_code == "2") {
//     // Payment success - update the database
//     console.log("Payment successful for order:", order_id);
//     res.sendStatus(200);
//   } else {
//     // Payment verification failed
//     console.log("Payment verification failed for order:", order_id);
//     res.sendStatus(400);
//   }
// })

// exports.notifyPayment = catchAsyncError(async (req, res) => {
//   const merchant_secret = process.env.MERCHANT_SECRET;

//   const {
//     merchant_id,
//     order_id,
//     payhere_amount,
//     payhere_currency,
//     status_code,
//     md5sig,
//   } = req.body;

//   const local_md5sig = crypto
//     .createHash("md5")
//     .update(
//       merchant_id +
//         order_id +
//         payhere_amount +
//         payhere_currency +
//         status_code +
//         crypto
//           .createHash("md5")
//           .update(merchant_secret)
//           .digest("hex")
//           .toUpperCase()
//     )
//     .digest("hex")
//     .toUpperCase();

//   console.log("Payment notification received:");
//   console.log("Order ID:", order_id);
//   console.log("Provided md5sig:", md5sig);
//   console.log("Generated local_md5sig:", local_md5sig);

//   if (local_md5sig === md5sig && status_code === "2") {
//     // Payment success - update the database
//     console.log("✅ Payment successful for order:", order_id);
//     res.sendStatus(200);
//   } else {
//     // Payment verification failed
//     console.log("❌ Payment verification failed for order:", order_id);
//     res.sendStatus(400);
//   }
// });

const crypto = require("crypto");
const catchAsyncError = require("../middleware/catchAsyncError");

// exports.processPayment = catchAsyncError(async (req, res) => {
//   const { order_id, amount, currency } = req.body;

//   const merchant_id = process.env.MERCHANT_ID;
//   const merchant_secret = process.env.MERCHANT_SECRET;

//   const hash = crypto
//     .createHash("md5")
//     .update(
//       merchant_id +
//         order_id +
//         amount +
//         currency +
//         crypto
//           .createHash("md5")
//           .update(merchant_secret)
//           .digest("hex")
//           .toUpperCase()
//     )
//     .digest("hex")
//     .toUpperCase();

//   console.log("Hash generated for order:", order_id);

//   res.json({ hash, merchant_id });
// });
exports.processPayment = catchAsyncError(async (req, res) => {
  const { order_id, amount, currency } = req.body;

  const merchant_id = process.env.MERCHANT_ID;
  const merchant_secret = process.env.MERCHANT_SECRET;

  console.log("merchant_id:", merchant_id);
  console.log("merchant_secret:", merchant_secret);
  console.log("order_id:", order_id, "amount:", amount, "currency:", currency);

  if (!merchant_id || !merchant_secret || !order_id || !amount || !currency) {
    return res.status(400).json({ error: "Missing required fields for payment processing." });
  }

  const hash = crypto
    .createHash("md5")
    .update(
      merchant_id +
        order_id +
        amount +
        currency +
        crypto
          .createHash("md5")
          .update(merchant_secret)
          .digest("hex")
          .toUpperCase()
    )
    .digest("hex")
    .toUpperCase();

  console.log("Hash generated for order:", order_id);

  res.json({ hash, merchant_id});
});


exports.notifyPayment = catchAsyncError(async (req, res) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = req.body;

  const merchant_secret = process.env.MERCHANT_SECRET;

  const local_md5sig = crypto
    .createHash("md5")
    .update(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        crypto
          .createHash("md5")
          .update(merchant_secret)
          .digest("hex")
          .toUpperCase()
    )
    .digest("hex")
    .toUpperCase();

  if (local_md5sig === md5sig && status_code == "2") {
    console.log("Payment successful for order:", order_id);
    res.sendStatus(200);
  } else {
    console.log("Payment verification failed for order:", order_id);
    res.sendStatus(400);
  }
});





