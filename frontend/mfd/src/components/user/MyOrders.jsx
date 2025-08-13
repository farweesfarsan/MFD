import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { MdOutlineReceipt, MdOutlineShoppingCart, MdCancel } from 'react-icons/md';
import { FaDownload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import OrderCancel from '../cart/OrderCancel';

const MyOrders = () => {
  const { user } = useSelector((state) => state.userState);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/order/getOrder', {
        withCredentials: true,
      });
      const sortedOrders = [...(response.data.orders || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setError('');
    } catch (err) {
      console.error('Failed to load orders', err);
      setError('Failed to fetch orders. Please login.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openCancelModal = (orderId) => {
    setIsCancelModalOpen(false); // reset before re-render
    setTimeout(() => {
      setSelectedOrderId(orderId);
      setIsCancelModalOpen(true);
    }, 0);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedOrderId(null);
    fetchOrders(); // Refresh orders after cancel
  };

  const getFormattedDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const statusColors = {
    Processing: 'text-yellow-600 bg-yellow-100',
    Dispatched: 'text-blue-600 bg-blue-100',
    Delivered: 'text-green-600 bg-green-100',
    Cancelled: 'text-red-600 bg-red-100',
    Pending: 'text-yellow-600 bg-yellow-100',
  };

  const ongoingOrders = orders.filter((order) =>
    ['Processing', 'Dispatched', 'Pending'].includes(order.orderStatus)
  );

  const completedOrders = orders.filter((order) =>
    ['Delivered', 'Cancelled'].includes(order.orderStatus)
  );

  return (
    <div className="px-4 sm:px-8 py-10 max-w-6xl mx-auto">
      <h1
        className="text-4xl font-extrabold text-center mb-10 text-transparent bg-clip-text"
        style={{
          background: 'linear-gradient(90deg, #0066ff, #00ccff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: "'Segoe UI', Roboto, sans-serif",
        }}
      >
        My Orders
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Ongoing Orders */}
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <MdOutlineShoppingCart className="text-3xl text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-700">Ongoing Orders</h2>
            </div>
            {ongoingOrders.length === 0 ? (
              <p className="text-gray-500">You have no ongoing orders.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {ongoingOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white shadow-lg p-6 rounded-xl border hover:shadow-xl transition-all duration-300 relative"
                  >
                    <p className="mb-1 text-sm text-gray-500">
                      Order ID: <span className="font-medium text-gray-700">{order._id}</span>
                    </p>
                    <p className="mb-1 text-sm">
                      Status:{' '}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus]}`}
                      >
                        {order.orderStatus}
                      </span>
                    </p>
                    <p className="mb-1 text-sm text-gray-700">
                      Total: <span className="font-semibold">Rs. {order.totalPrice}</span>
                    </p>
                    <p className="mb-1 text-sm text-gray-600">
                      Date: {getFormattedDate(order.createdAt)}
                    </p>
                   <p><strong>Order Code:</strong> {order.verificationCode}</p>


                    {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing') && (
                      <button
                        onClick={() => openCancelModal(order._id)}
                        className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                        title="Cancel Order"
                      >
                        <MdCancel className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Completed Orders */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <MdOutlineReceipt className="text-3xl text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-700">Order History</h2>
            </div>
            {completedOrders.length === 0 ? (
              <p className="text-gray-500">No previous orders found.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {completedOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white shadow-lg p-6 rounded-xl border flex justify-between items-start gap-4 hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      <p className="mb-1 text-sm text-gray-500">
                        Order ID: <span className="font-medium text-gray-700">{order._id}</span>
                      </p>
                      <p className="mb-1 text-sm">
                        Status:{' '}
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.orderStatus]}`}
                        >
                          {order.orderStatus}
                        </span>
                      </p>
                      <p className="mb-1 text-sm text-gray-700">
                        Total: <span className="font-semibold">Rs. {order.totalPrice}</span>
                      </p>
                      <p className="mb-1 text-sm text-gray-600">
                        Date: {getFormattedDate(order.createdAt)}
                      </p>
                      <p className="mb-1 text-sm text-gray-600">
                      Order Code: <span className="font-semibold">{order.orderCode}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Cancel Modal */}
      {isCancelModalOpen && selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
            <OrderCancel
              orderId={selectedOrderId}
              onClose={closeCancelModal}
              key={selectedOrderId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
