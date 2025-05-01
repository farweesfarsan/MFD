// import subscription from "../models/subscription";
const  Subscription  = require('../models/subscription');

exports.handleWebHook = async (req,res)=>{
    const { order_id, status_code } = req.body;

    if(status_code == 2){
        await Subscription.findOneAndUpdate(
            {orderId: order_id},
            { status: 'Active', nextBillingDate:new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }   
        )
    }
    res.sendStatus(200);
}