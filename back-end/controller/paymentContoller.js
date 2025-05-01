

const crypto = require("crypto");
const catchAsyncError = require("../middleware/catchAsyncError");


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





