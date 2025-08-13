import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CheckoutSteps from "./checkoutStep";
import { createOrder } from "../../actions/orderActions";
import { orderCompleted } from "../../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../../context/paymentContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowBackCircle } from "react-icons/io5";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deliveryInfo, items } = useSelector((state) => state.cartState);
  const { user } = useSelector((state) => state.authState);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

  const { paymentMethod, setPaymentMethod } = usePayment();

  useEffect(() => {
    if (!orderInfo) {
      // Prevent back navigation
      window.history.pushState(null, null, window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, null, window.location.href);
      };
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [orderInfo]);

  const handleOrderCreation = async (orderData) => {
    await dispatch(createOrder(orderData));
    sessionStorage.setItem("recentOrder", JSON.stringify(orderData));
    dispatch(orderCompleted());
    navigate("/payment/success");
  };

  const handlePayment = async () => {
    if (!orderInfo) return;

    const baseOrderData = {
      orderItems: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        product: item.product,
      })),
      user: user._id,
      deliveryInfo: {
        address: deliveryInfo.address,
        city: deliveryInfo.city,
        phoneNo: deliveryInfo.phoneNo,
      },
      itemsPrice: orderInfo.itemsPrice,
      deliveryCharge: orderInfo.deliveryCharge,
      totalPrice: orderInfo.totalPrice,
      paymentInfo: {
        id: "",
        status: "",
      },
    };

    if (paymentMethod === "cod") {
      const codOrderData = {
        ...baseOrderData,
        paymentInfo: {
          id: "COD_" + new Date().getTime(),
          status: "Not Paid",
        },
      };
      await handleOrderCreation(codOrderData);
      return;
    }

    const paymentDetails = {
      order_id: "ORD_" + new Date().getTime(),
      amount: orderInfo.totalPrice,
      currency: "LKR",
      name: user.name,
      email: user.email,
      phone: deliveryInfo.phoneNo,
      address: deliveryInfo.address,
      city: deliveryInfo.city,
      country: "Sri Lanka",
    };

    try {
      const response = await fetch(
        "http://localhost:8000/payment/paymentProcess",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentDetails),
        }
      );

      if (response.ok) {
        const { hash, merchant_id } = await response.json();

        const payment = {
          sandbox: true,
          merchant_id,
          return_url: "http://localhost:5173/payment/success",
          cancel_url: "http://localhost:5173/payment/cancel",
          notify_url: "http://localhost:8000/payment/notifyPayment",
          order_id: paymentDetails.order_id,
          items: `Items : ${items.map((item) => item.name).join(", ")}`,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          first_name: user.name.split(" ")[0],
          last_name: user.name.split(" ")[1] || "",
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          address: paymentDetails.address,
          city: paymentDetails.city,
          country: paymentDetails.country,
          hash,
        };

        if (window.payhere) {
          window.payhere.onCompleted = async function (orderId) {
            const updatedOrderData = {
              ...baseOrderData,
              paymentInfo: {
                id: orderId,
                status: "Paid",
              },
              paidAt: new Date(),
            };
            await handleOrderCreation(updatedOrderData);
          };

          window.payhere.onDismissed = function () {
            console.log("Payment dismissed by user.");
          };

          window.payhere.onError = function (error) {
            console.error("Payment error:", error);
          };

          window.payhere.startPayment(payment);
        } else {
          console.error("PayHere SDK not loaded.");
        }
      } else {
        console.error("Failed to generate hash for payment.");
      }
    } catch (error) {
      console.error("An error occurred during payment:", error);
    }
  };

  return (
    <Fragment>
      <ToastContainer />
      <CheckoutSteps delivery={true} confirmOrder={true} payment={true} />

      {!orderInfo ? (
        <div className="flex flex-col items-center justify-center mt-16 space-y-6">
          <div className="max-w-2xl w-full p-6 text-center bg-yellow-100 border border-yellow-300 rounded shadow">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Order information is missing
            </h2>
            <p className="text-yellow-700">
              It seems like your order session has expired. Please go back and
              create a new order. If you want to cancel the last placed order,
              please visit here  for the cancellation process.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-6 py-3 bg-[#1b6b75] text-white text-lg font-medium rounded hover:bg-[#155e67] transition"
          >
            <IoArrowBackCircle size={28} />
            Back to Home
          </button>
          <button
              onClick={() => navigate("/profile/myOrders")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white text-lg font-medium rounded hover:bg-red-700 transition"
            >
            <IoArrowBackCircle size={28} />
            My Orders
            </button>
        </div>
      ) : (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Select Payment Method
          </h2>

          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="payhere"
                checked={paymentMethod === "payhere"}
                onChange={() => setPaymentMethod("payhere")}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-gray-700 text-lg">
                Pay Online (PayHere)
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="text-gray-700 text-lg">Cash on Delivery</span>
            </label>
          </div>

          <button
            onClick={handlePayment}
            className={`w-full mt-8 text-white text-lg font-semibold py-2 px-4 rounded transition duration-200 ${
              !orderInfo
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={!orderInfo}
          >
            {paymentMethod === "cod" ? "Get Invoice" : "Proceed with Payment"}
          </button>
        </div>
      )}
    </Fragment>
  );
};

export default Payment;
