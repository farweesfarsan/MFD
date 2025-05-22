import React, { useEffect, useState } from 'react';
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateOrder } from '../../../actions/orderActions';
import { toast } from 'react-toastify';

const UpdateOrder = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  const adminOrdersData = useSelector((state) => state.orderState.adminOrdersData);
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("Pending");
  const [paymentStatus, setPaymentStatus] = useState("Pending");

  useEffect(() => {
    const matchedOrder = adminOrdersData.find((order) => order._id === id);
    if (matchedOrder) {
      setOrder(matchedOrder);
      setOrderStatus(matchedOrder.orderStatus);
      setPaymentStatus(matchedOrder.orderStatus === "Delivered" ? "Paid" : "Pending");
      sessionStorage.setItem("selectedOrder", JSON.stringify(matchedOrder));
    } else {
      const storedOrder = sessionStorage.getItem("selectedOrder");
      if (storedOrder) {
        const parsedOrder = JSON.parse(storedOrder);
        if (parsedOrder._id === id) {
          setOrder(parsedOrder);
          setOrderStatus(parsedOrder.orderStatus);
          setPaymentStatus(parsedOrder.orderStatus === "Delivered" ? "Paid" : "Pending");
        }
      }
    }
  }, [id, adminOrdersData]);

  useEffect(() => {
    if (orderStatus === "Delivered") {
      setPaymentStatus("Paid");
    } else {
      setPaymentStatus("Pending");
    }
  }, [orderStatus]);

  const submitHandler = async () => {
    if (!order) return;

    const currentStatus = order.orderStatus;

    // Define allowed status transitions
    const validTransitions = {
      "Processing": ["Dispatched", "Delivered","Cancelled"],
      "Dispatched": ["Delivered"],
      "Delivered": [],
      "Cancelled": []
    };

    if (!validTransitions[currentStatus].includes(orderStatus)) {
      toast.error(`Invalid status change: You can't change from "${currentStatus}" to "${orderStatus}"`, {
        position: "bottom-center",
      });
      return;
    }

    setLoading(true);
    try {
      const orderData = { orderStatus };
      await dispatch(updateOrder(id, orderData));
      toast.success('Order updated successfully!', { position: "bottom-center" });
    } catch (err) {
      toast.error('Failed to update order!', { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return <div className="p-4 text-center">Loading order details...</div>;
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar for large screens */}
      <div className="hidden md:block w-64 bg-gray-800 absolute top-0 bottom-0">
        <div className="sticky top-0 min-h-screen">
          <Sidebar />
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="fixed left-0 top-0 w-64 h-full bg-white z-50 shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full p-4 md:pl-8 md:ml-64">
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Order Details</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-4xl mx-auto">
          <p className="text-2xl font-bold text-gray-800 mb-6">Order ID: {order._id}</p>

          {/* Update Order Status */}
          <div className="flex justify-end items-center flex-col md:flex-row gap-4 mb-6">
            <select
              className="form-select w-full md:w-60 p-2 border border-gray-300 rounded-lg shadow-sm"
              onChange={(e) => setOrderStatus(e.target.value)}
              value={orderStatus}
              name="status"
            >
              <option value="Processing">Pending</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              disabled={loading}
              onClick={submitHandler}
              className={`px-4 py-2 text-white rounded-md transition duration-200 ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          {/* Shipping Info */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Delivery Info</h2>
            <p className="mb-1"><span className="font-medium text-gray-600">Name:</span> Tameem</p>
            <p className="mb-1"><span className="font-medium text-gray-600">Phone:</span> {order.deliveryInfo?.phoneNo}</p>
            <p className="mb-1"><span className="font-medium text-gray-600">Address:</span> {order.deliveryInfo?.address}, {order.deliveryInfo?.city}</p>
            <p><span className="font-medium text-gray-600">Amount:</span> <span className="text-green-700 font-semibold">{order.finalPrice}</span></p>
          </section>

          {/* Payment */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Payment Status</h2>
            <p className={`font-bold ${paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
              {paymentStatus}
            </p>
          </section>

          {/* Order Status */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Order Status</h2>
            <p className="text-green-600 font-bold">{orderStatus}</p>
          </section>

           {order.cancellationReason ? (
            <section>
            <p className='font-bold text-gray-700 mb-3 border-b pb-2'>
            Cancellation Reason:
            <span className='text-red-600 text-[15px] ml-2'>{order.cancellationReason}</span>
            </p>
            </section>
             
            ):null}
            
          {/* Order Items */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Order Items</h2>
            <div className="space-y-6">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <a href="#" className="text-blue-600 hover:underline font-medium">
                        {item.name}
                      </a>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-700">{item.price}</p>
                    <p className="text-sm text-gray-500">{item.quantity}<span className='ml-1'>Item(s)</span></p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
