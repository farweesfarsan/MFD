import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center py-10 ">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center animate-fadeIn">
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-full p-4">
              <svg
                className="h-12 w-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-red-600">Subscription Cancelled</h1>
          <p className="text-gray-600">
            Your subscription has been cancelled. If this was a mistake, please try again.
          </p>
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

export default SubscriptionCancel;

