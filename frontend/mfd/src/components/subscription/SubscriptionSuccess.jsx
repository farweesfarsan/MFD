import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import { IoArrowBackCircle } from "react-icons/io5";
import axios from "axios"; 
import MD5 from "crypto-js/md5"; 
import config from '../../config/config';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const subscriptionData = JSON.parse(localStorage.getItem('subscriptionData')); 
  const user = localStorage.getItem('userId');
  
  const orderId = subscriptionData.order_id;
  const paymentId = subscriptionData.payment_id;
  const amount = subscriptionData.amount;
  const currency = subscriptionData.currency;
  const userId = user;
  const planType = subscriptionData.custom_2;
  const statusCode = "2";
  const merchantId = subscriptionData.merchant_id;
  
  const merchantSecret = config.MERCHANT_SECRET;

  // Use MD5 from crypto-js
  const hashedSecret = MD5(merchantSecret).toString().toUpperCase(); // Hash the secret using MD5

  // Step 2: create the raw string
  const raw = merchantId + orderId + paymentId + amount + currency + statusCode + hashedSecret;

  // Step 3: create md5sig
  const md5sig = MD5(raw).toString().toUpperCase(); // Hash the raw string using MD5

  // Now you have a correct md5sig
  console.log("md5sig:", md5sig);

  // Notify the backend that the subscription was successful
  useEffect(() => {
    if (statusCode === "2") {
      // Make a POST request to the subscription-notify route
      axios
        .post("http://localhost:8000/sub/subscription-notify", {
          merchant_id: "1230099", 
          order_id: orderId,
          payment_id: paymentId,
          status_code: statusCode,
          md5sig: md5sig,
          amount: amount,
          currency: currency,
          custom_1: userId,
          custom_2: planType,
        },
        {
          withCredentials: true, 
        }
        )
        .then((response) => {
          setMessage(response.data.message);
          setIsSuccess(response.data.success);
        })
        .catch((error) => {
          setMessage("There was an error processing your subscription.");
          setIsSuccess(false);
          console.error("Subscription notify error:", error);
        });
    } else {
      setMessage("Payment failed or invalid status code.");
      setIsSuccess(false);
    }
  }, [orderId, paymentId, statusCode, md5sig, amount, currency, userId, planType]);

  return (
    <div className="flex items-center justify-center py-10">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center animate-fadeIn">
        <div className="mb-6">
          {isSuccess ? (
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-full p-4">
                <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-full p-4">
                <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              </div>
            </div>
          )}
          <h1 className="text-3xl font-bold mb-2">{isSuccess ? "Subscription Successful!" : "Subscription Failed"}</h1>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-6 py-3 bg-[#1b6b75] text-white text-lg font-medium rounded hover:bg-[#155e67] transition"
          >
            <IoArrowBackCircle size={28} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
