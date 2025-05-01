import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSubscriptionAction } from "../../actions/subscriptionActions"; // Adjust the path correctly!
import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Silver",
    price: 2000,
    deliveries: "3 times / week",
    discount: "5% Discount for every bill",
    perks: ["Free Curd(250g)/month"],
  },
  {
    title: "Premium",
    price: 4500,
    deliveries: "Daily Delivery",
    discount: "15% Discount for every bill",
    perks: ["1 Flavored Milk(1l)/month", "Small Ghee / month", "Priority Delivery"],
  },
  {
    title: "Gold",
    price: 3000,
    deliveries: "4 times / week",
    discount: "10% Discount for every bill",
    perks: ["Free Paneer(250g)/month", "Priority Delivery"],
  },
];

const SubscriptionPlans = ({ userId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.authState);
  const { deliveryInfo } = useSelector(state => state.cartState);
  const navigate = useNavigate();

  const handleSubscribe = async (plan) => {
    if(!user){
      navigate('/login');
    }
    try {
      const payload = {
        planType: plan.title,
        name: user.name,
        email: user.email,
        userId,
        address: deliveryInfo.address || "",
        phoneNo: deliveryInfo.phoneNo || "",
        price: plan.price,
      };

      const subscriptionResponse = await dispatch(createSubscriptionAction(payload));

      // After successful subscription, redirect to PayHere
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sandbox.payhere.lk/pay/checkout";

      Object.entries(subscriptionResponse).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error("Subscription Error:", error);
      
    }
  };

  return (
    <div className="p-6 flex flex-wrap justify-center gap-x-4 gap-y-6">
      {plans.map((plan, index) => {
        let cardBgClr = "bg-white";
        let buttonClr = "bg-green-600 hover:bg-green-700";
        let textClr = "text-green-600";
        let titleClr = "text-gray-500";

        if (plan.title === "Gold") {
          cardBgClr = "bg-yellow-200";
          buttonClr = "bg-yellow-500 hover:bg-yellow-600";
          textClr = "text-green-600";
          titleClr = "text-yellow-800";
        }

        if (plan.title === "Silver") {
          cardBgClr = "bg-gray-300";
          buttonClr = "bg-gray-800 hover:bg-gray-500";
          textClr = "text-green-600";
          titleClr = "text-gray-800";
        }

        if (plan.title === "Premium") {
          cardBgClr = "bg-purple-300";
          buttonClr = "bg-blue-600 hover:bg-blue-700";
          textClr = "text-green-600";
          titleClr = "text-purple-900";
        }

        return (
          <div
            key={index}
            className={`${cardBgClr} shadow-xl rounded-2xl p-6 hover:scale-105 transition-transform w-72 min-h-[400px] flex flex-col`}
          >
            <div>
              <h2 className={`text-2xl ${titleClr} text-center font-bold mb-2`}>{plan.title}</h2>
              <p className={`text-lg ${textClr} font-semibold mb-2`}>
                LKR {plan.price} / month
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Delivery: {plan.deliveries}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Discount: {plan.discount}
              </p>
              <ul className="text-sm list-disc pl-4 mb-4 text-gray-600">
                {plan.perks.map((perk, i) => (
                  <li key={i}>{perk}</li>
                ))}
              </ul>
            </div>
            <button
              className="bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 hover:from-red-600 hover:via-pink-500 hover:to-purple-600 text-white px-6 py-2 rounded-lg mt-auto text-lg transition-all duration-300"
              onClick={() => handleSubscribe(plan)}
            >
              Subscribe
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;
