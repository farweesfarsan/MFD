import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrder } from "../../actions/orderActions";
import { clearOrderCancel } from "../../slices/orderSlice";

const OrderCancel = ({ orderId, onClose }) => {
  const [cancelReason, setCancelReason] = useState("");
  const dispatch = useDispatch();

  // Get loading, isOrderCanceled and error states from Redux
  const { loading, isOrderCanceled, error } = useSelector((state) => state.orderState);

  const handleCancelOrder = () => {
    if (cancelReason.trim().length < 5) {
      return toast.error("Cancellation reason must be at least 5 characters.");
    }
    dispatch(cancelOrder(orderId, cancelReason));
  };

  useEffect(() => {
    if (isOrderCanceled) {
      toast.success("Order cancelled successfully!", {
        position: "bottom-center",
        theme: "dark",
      });
      setCancelReason("");
      dispatch(clearOrderCancel());  // dispatch clear action to reset state
      onClose();
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        theme: "dark",
      });
      dispatch(clearOrderCancel());  // also clear error after showing toast
    }
  }, [isOrderCanceled, error, dispatch, onClose]);

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Cancel Order?</h2>
      <p className="text-gray-600 mb-2">Please tell us why you're cancelling this order:</p>
      <textarea
        rows="4"
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none text-sm mb-4"
        placeholder="Enter your reason..."
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
        disabled={loading}
      />

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCancelOrder}
          disabled={loading}
          className={`${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
          } bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300`}
        >
          {loading ? "Cancelling..." : "Yes, Cancel"}
        </button>
        <button
          onClick={() => {
            setCancelReason("");
            onClose();
          }}
          disabled={loading}
          className={`${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
          } bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-all duration-300`}
        >
          No, Go Back
        </button>
      </div>
    </>
  );
};

export default OrderCancel;
