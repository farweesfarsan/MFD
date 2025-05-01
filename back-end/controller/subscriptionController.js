const crypto = require("crypto");
const catchAsyncError = require("../middleware/catchAsyncError");
const Subscription = require("../models/subscriptionPlan");
// const orderModel = require("../models/orderModel");

const payhereSecret = process.env.MERCHANT_SECRET;
const merchantId = process.env.MERCHANT_ID;

const generatePaymentId = () => {
  return 'PAY' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

exports.createSubscription = catchAsyncError(async (req, res) => {

  const { planType, name, email, phoneNo, userId, address } = req.body;

  const prices = {
    Silver: 1500,
    Premium: 4500,
    Gold: 3000,
  };

  const orderId = `SUB_${Date.now()}`;
  const amount = prices[planType]?.toFixed(2);
  const currency = "LKR";

  if (!amount) {
    return res.status(400).json({ error: "Invalid plan type selected." });
  }

  if (!merchantId || !payhereSecret) {
    return res.status(500).json({ error: "Merchant credentials missing." });
  }

  const hashedSecret = crypto.createHash("md5").update(payhereSecret).digest("hex").toUpperCase();
  const raw = merchantId + orderId + amount + currency + hashedSecret;
  const hash = crypto.createHash("md5").update(raw).digest("hex").toUpperCase();

  const paymentId = generatePaymentId();
  const subscriptionData = {
    merchant_id: merchantId,
    return_url: "http://localhost:5173/subscription-success" ,
    cancel_url: "http://localhost:5173/subscription-cancel",
    notify_url: "http://localhost:8000/sub/subscription-notify",
    order_id: orderId,
    items: `${planType} Plan Subscription`,
    amount,
    currency,
    first_name: name,
    last_name: "",
    email,
    phone: phoneNo || "",
    address: address || "",
    city: "Colombo",
    country: "Sri Lanka",
    custom_1: userId,
    custom_2: planType,
    hash,
    payment_id: paymentId,
  };

  res.json(subscriptionData);
});

// Notify Subscription Status
exports.subscriptionNotify = catchAsyncError(async (req, res) => {
  
  const {
    merchant_id,
    order_id,
    payment_id,
    status_code,
    md5sig,
    amount,
    currency,
    custom_1: userId,
    custom_2: planType,
  } = req.body;

  if (!merchant_id || !order_id || !payment_id || !status_code || !md5sig || !amount || !currency || !userId || !planType) {
    return res.status(400).json({ success: false, message: "Missing required fields in request body" });
  }

 
  const hashedSecret = crypto.createHash("md5").update(payhereSecret).digest("hex").toUpperCase();
  const rawSig = merchant_id + order_id + payment_id + amount + currency + status_code + hashedSecret;
  const localSig = crypto.createHash("md5").update(rawSig).digest("hex").toUpperCase();


  if (md5sig === localSig && status_code === "2") {
    const start = new Date();
    const end = new Date(start);
    end.setDate(end.getDate() + 30); // 30 days

    await Subscription.create({
      userId,
      planType,
      amount: parseFloat(amount),
      orderId: order_id,
      paymentId: payment_id,
      startDate: start,
      endDate: end,
      isActive: true,
    });

    return res.status(200).json({ success: true, message: "Subscription recorded successfully." });
  }

  return res.status(400).json({
    success: false,
    message: "Invalid signature or payment not successful.",
  });
});

exports.getSubscriptionDetailsById = catchAsyncError(async(req,res)=>{
   try {
     const { userId } = req.body;
     const subscription = await Subscription.findOne({ userId });

     if(!subscription){
       return res.status(404).json({ message: 'Subscription Details not found for this UserId'});
     }

     return res.status(200).json(subscription);

   } catch (error) {
     console.log("Error fetching subscription",error);
     return res.status(500).json({ message: "Server Error"});
   }
})

