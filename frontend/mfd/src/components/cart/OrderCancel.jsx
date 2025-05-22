import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { Dialog } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrder } from "../../actions/orderActions";
import { clearOrderCancel } from "../../slices/orderSlice";


const OrderCancel = ({ orderId, onClose }) => {
  // keep existing states...
const [cancelReason, setCancelReason] = useState("");
const [isCancelling, setIsCancelling] = useState(false);
const dispatch = useDispatch();
const { loading,isOrderCanceled,error } = useSelector(state => state.orderState);

  const handleCancelOrder = async () => {
    if (cancelReason.trim().length < 5) {
      return toast.error("Cancellation reason must be at least 5 characters.");
    }
    dispatch(cancelOrder(orderId,cancelReason));
   };

   useEffect(()=>{
    if(isOrderCanceled){
      toast.success("Order cancelled successfully!", {
        position: "bottom-center",
        theme: "dark",
      });
      setCancelReason("");
      clearOrderCancel();
      onClose();
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        theme: "dark",
      });
    }
   },[isOrderCanceled, error,])

  

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Cancel Order?
      </h2>
      <p className="text-gray-600 mb-2">
        Please tell us why you're cancelling this order:
      </p>
      <textarea
        rows="4"
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none text-sm mb-4"
        placeholder="Enter your reason..."
        value={cancelReason}
        onChange={(e) => setCancelReason(e.target.value)}
      />

      <div className="flex justify-center gap-4">
        <button
          onClick={handleCancelOrder}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
        >
          {isCancelling ? "Cancelling..." : "Yes, Cancel"}
        </button>
        <button
          onClick={() => {
            setCancelReason("");
            onClose();
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-all duration-300"
        >
          No, Go Back
        </button>
      </div>
    </>
  );
};


export default OrderCancel;

