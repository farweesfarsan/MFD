// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const DeliveryStaffPage = () => {
//   const [staffData, setStaffData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("today");

//   const sampleNotifiedOrders = [
//     {
//       _id: "n1",
//       orderNumber: "ORD-1003",
//       status: "Notified",
//       customerName: "Sajid Fairooz",
//       mobile: "0759988776",
//       address: "789 Galle Road, Galle",
//       items: ["Rice & Curry", "Water Bottle"],
//       total: 1200,
//     },
//   ];

//   const orderHistory = [
//     { date: "2025-06-30", items: 10, cost: 2500 },
//     { date: "2025-06-29", items: 8, cost: 2000 },
//     { date: "2025-06-28", items: 6, cost: 1500 },
//     { date: "2025-06-27", items: 12, cost: 3000 },
//     { date: "2025-06-26", items: 9, cost: 2200 },
//     { date: "2025-06-25", items: 11, cost: 2750 },
//     { date: "2025-06-24", items: 7, cost: 1800 },
//   ];

//   const staffId = "64a12b...";

//   useEffect(() => {
//     const fetchStaffData = async () => {
//       try {
//         const response = await axios.get(`/api/delivery-staff/${staffId}`);
//         setStaffData({
//           ...response.data,
//           notifiedOrders: sampleNotifiedOrders,
//         });
//       } catch (error) {
//         console.error("Failed to fetch delivery staff data:", error);
//         setStaffData({
//           name: "Farwees",
//           email: "farwees@example.com",
//           mobile: "0770000000",
//           notifiedOrders: sampleNotifiedOrders,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStaffData();
//   }, []);

//   const handleAccept = (orderId) => {
//     console.log(`✅ Accepted order: ${orderId}`);
//   };

//   const handleReject = (orderId) => {
//     console.log(`❌ Rejected order: ${orderId}`);
//   };

//   const renderOrderCard = (order) => (
//     <div
//       key={order._id}
//       className="border-b border-gray-200 pb-4 mb-6 last:border-none last:mb-0"
//     >
//       <div className="flex items-center text-sm text-gray-600 mb-1">
//         <FaMapMarkerAlt className="text-red-500 mr-2" />
//         {order.address}
//       </div>
//       <p><strong>Order No:</strong> {order.orderNumber}</p>
//       <p><strong>Customer:</strong> {order.customerName}</p>
//       <p><strong>Phone:</strong> {order.mobile}</p>
//       <p><strong>Items:</strong> {order.items.join(", ")}</p>
//       <p><strong>Total:</strong> Rs. {order.total}</p>
//       <p className="text-xs text-gray-400 mt-1 mb-2">Status: {order.status}</p>

//       <div className="flex gap-3">
//         <button
//           onClick={() => handleAccept(order._id)}
//           className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
//         >
//           Accept
//         </button>
//         <button
//           onClick={() => handleReject(order._id)}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
//         >
//           Reject
//         </button>
//       </div>
//     </div>
//   );

//   const filterData = () => {
//     const now = new Date();
//     return orderHistory.filter((entry) => {
//       const orderDate = new Date(entry.date);
//       const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
//       if (filter === "today") return diffDays < 1;
//       if (filter === "7days") return diffDays <= 7;
//       if (filter === "month") return diffDays <= 30;
//       return true;
//     });
//   };

//   const getWeeklySummaries = (data) => {
//     const weeks = {};
//     data.forEach((entry) => {
//       const date = new Date(entry.date);
//       const monday = new Date(date);
//       monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
//       const sunday = new Date(monday);
//       sunday.setDate(monday.getDate() + 6);
//       const key = `${monday.toISOString().split("T")[0]}_${sunday.toISOString().split("T")[0]}`;
//       const label = `${monday.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       })} - ${sunday.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       })}`;

//       if (!weeks[key]) {
//         weeks[key] = { weekRange: label, items: 0, cost: 0 };
//       }

//       weeks[key].items += entry.items;
//       weeks[key].cost += entry.cost;
//     });

//     return Object.values(weeks);
//   };

//   const filteredOrders = filterData();
//   const totalItems = filteredOrders.reduce((sum, o) => sum + o.items, 0);
//   const totalCost = filteredOrders.reduce((sum, o) => sum + o.cost, 0);
//   const chartData = filter === "month" ? getWeeklySummaries(filteredOrders) : filteredOrders;

//   if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
//   if (!staffData) return <div className="text-center mt-10 text-red-500">Staff not found.</div>;

//   const { notifiedOrders = [] } = staffData;

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">

//       {/* Profile Section */}
//       <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Staff Profile</h2>
//         <p><strong>Name:</strong> {staffData.name || "N/A"}</p>
//         <p><strong>Mobile:</strong> {staffData.mobile || "N/A"}</p>
//         <p><strong>Email:</strong> {staffData.email || "N/A"}</p>
//       </div>

//       {/* Quick Stats Section */}
//       <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
//         <div className="bg-blue-100 text-blue-900 rounded-lg p-4 shadow">
//           <p className="font-bold text-lg">Orders Today</p>
//           <p className="text-2xl">{orderHistory.filter(o => o.date === new Date().toISOString().split("T")[0]).length}</p>
//         </div>
//         <div className="bg-green-100 text-green-900 rounded-lg p-4 shadow">
//           <p className="font-bold text-lg">Total Items Delivered</p>
//           <p className="text-2xl">{totalItems}</p>
//         </div>
//         <div className="bg-yellow-100 text-yellow-900 rounded-lg p-4 shadow">
//           <p className="font-bold text-lg">Total Earnings</p>
//           <p className="text-2xl">Rs. {totalCost}</p>
//         </div>
//       </div>

//       {/* Order History */}
//       <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-10">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Order History</h2>

//         <div className="mb-4 flex gap-4">
//           {["today", "7days", "month"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1 rounded ${
//                 filter === f ? "bg-blue-500 text-white" : "bg-gray-200"
//               }`}
//             >
//               {f === "today" ? "Today" : f === "7days" ? "Last 7 Days" : "Last Month"}
//             </button>
//           ))}
//         </div>

//         <div className="bg-gray-50 p-4 rounded mb-6">
//           <p className="text-gray-700 mb-1">
//             <strong>Total Items Delivered:</strong> {totalItems}
//           </p>
//           <p className="text-gray-700">
//             <strong>Total Cost of Orders:</strong> Rs. {totalCost}
//           </p>
//         </div>

//         <div className="h-64 relative">
//           {chartData.length === 0 ? (
//             <div className="flex justify-center items-center h-full text-gray-400 text-xl font-semibold">
//               No orders
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData}>
//                 <XAxis dataKey={filter === "month" ? "weekRange" : "date"} />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="items" fill="#60A5FA" name="Items Delivered" />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>

//       {/* Notified Orders */}
//       <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
//         <h3 className="text-xl font-semibold text-green-600 mb-4">Notified Orders</h3>
//         {notifiedOrders.length === 0 ? (
//           <p className="text-gray-500">No notified orders.</p>
//         ) : (
//           notifiedOrders.map((order) => renderOrderCard(order))
//         )}
//       </div>
//     </div>
//   );
// };

// export default DeliveryStaffPage;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const DeliveryStaffPage = () => {
//   const [staffData, setStaffData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("today");
//   const [notifiedOrders, setNotifiedOrders] = useState([]);

//   const { user } = useSelector((state) => state.authState);
//   const location = useLocation();

//   const orderHistory = [
//     { date: "2025-06-30", items: 10, cost: 2500 },
//     { date: "2025-06-29", items: 8, cost: 2000 },
//     { date: "2025-06-28", items: 6, cost: 1500 },
//     { date: "2025-06-27", items: 12, cost: 3000 },
//     { date: "2025-06-26", items: 9, cost: 2200 },
//     { date: "2025-06-25", items: 11, cost: 2750 },
//     { date: "2025-06-24", items: 7, cost: 1800 },
//   ];

//   // Fetch delivery staff data
//   useEffect(() => {
//     const fetchStaffData = async () => {
//       try {
//         const response = await axios.get(`/api/delivery-staff/${user._id}`);
//         setStaffData(response.data);
//       } catch (error) {
//         console.error("Failed to fetch delivery staff data:", error);
//         setStaffData({
//           name: user.name,
//           email: user.email,
//           mobile: "0770000000",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?._id) {
//       fetchStaffData();
//     }
//   }, [user]);

//   // Setup WebSocket connection
//   useEffect(() => {
//   const ws = new WebSocket('ws://localhost:8000');

//   ws.onopen = () => {
//     // Register this delivery staff (replace with real ID)
//     ws.send(JSON.stringify({ type: 'register_staff', staffId: userId }));
//   };

//   ws.onmessage = (event) => {
//     const data = JSON.parse(event.data);
//     if (data.type === 'new_order') {
//       setStaffData(prev => ({
//         ...prev,
//         notifiedOrders: [data.order, ...(prev?.notifiedOrders || [])],
//       }));
//     }
//   };

//   return () => ws.close();
// }, []);


//   // Optional: append notified order from route state (when clicked from header)
//   useEffect(() => {
//     const stateOrder = location?.state?.notifiedOrder;
//     if (stateOrder) {
//       setNotifiedOrders((prev) => [stateOrder, ...prev]);
//     }
//   }, [location]);

//   const handleAccept = (orderId) => {
//     console.log(`✅ Accepted order: ${orderId}`);
//     // Optionally: Send confirmation to backend
//   };

//   const handleReject = (orderId) => {
//     console.log(`❌ Rejected order: ${orderId}`);
//     // Optionally: Inform backend
//   };

//   const renderOrderCard = (order) => (
//     <div
//       key={order.orderId || order._id}
//       className="border-b border-gray-200 pb-4 mb-6 last:border-none last:mb-0"
//     >
//       <div className="flex items-center text-sm text-gray-600 mb-1">
//         <FaMapMarkerAlt className="text-red-500 mr-2" />
//         {order.address || "Unknown Address"}
//       </div>
//       <p><strong>Order ID:</strong> {order.orderId}</p>
//       <p><strong>Phone:</strong> {order.phoneNo}</p>
//       <p><strong>City:</strong> {order.city}</p>
//       <p><strong>Items:</strong> {order.orderItems?.map(i => i.name).join(", ")}</p>
//       <p><strong>Total:</strong> Rs. {order.totalPrice}</p>
//       <p className="text-xs text-gray-400 mt-1 mb-2">Status: {order.status}</p>

//       <div className="flex gap-3">
//         <button
//           onClick={() => handleAccept(order.orderId)}
//           className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
//         >
//           Accept
//         </button>
//         <button
//           onClick={() => handleReject(order.orderId)}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
//         >
//           Reject
//         </button>
//       </div>
//     </div>
//   );

//   const filterData = () => {
//     const now = new Date();
//     return orderHistory.filter((entry) => {
//       const orderDate = new Date(entry.date);
//       const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
//       if (filter === "today") return diffDays < 1;
//       if (filter === "7days") return diffDays <= 7;
//       if (filter === "month") return diffDays <= 30;
//       return true;
//     });
//   };

//   const getWeeklySummaries = (data) => {
//     const weeks = {};
//     data.forEach((entry) => {
//       const date = new Date(entry.date);
//       const monday = new Date(date);
//       monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
//       const sunday = new Date(monday);
//       sunday.setDate(monday.getDate() + 6);
//       const key = `${monday.toISOString().split("T")[0]}_${sunday.toISOString().split("T")[0]}`;
//       const label = `${monday.toLocaleDateString("en-US", {
//         month: "short", day: "numeric",
//       })} - ${sunday.toLocaleDateString("en-US", {
//         month: "short", day: "numeric",
//       })}`;

//       if (!weeks[key]) {
//         weeks[key] = { weekRange: label, items: 0, cost: 0 };
//       }

//       weeks[key].items += entry.items;
//       weeks[key].cost += entry.cost;
//     });

//     return Object.values(weeks);
//   };

//   const filteredOrders = filterData();
//   const totalItems = filteredOrders.reduce((sum, o) => sum + o.items, 0);
//   const totalCost = filteredOrders.reduce((sum, o) => sum + o.cost, 0);
//   const chartData = filter === "month" ? getWeeklySummaries(filteredOrders) : filteredOrders;

//   if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
//   if (!staffData) return <div className="text-center mt-10 text-red-500">Staff not found.</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">

//       {/* Profile Section */}
//       <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Staff Profile</h2>
//         <p><strong>Name:</strong> {staffData.name || "N/A"}</p>
//         <p><strong>Mobile:</strong> {staffData.mobile || "N/A"}</p>
//         <p><strong>Email:</strong> {staffData.email || "N/A"}</p>
//       </div>

//       {/* Quick Stats */}
//       <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
//         <div className="bg-blue-100 text-blue-900 rounded-lg p-4 shadow">
//           <p className="font-bold text-lg">Orders Today</p>
//           <p className="text-2xl">{filteredOrders.filter(o => o.date === new Date().toISOString().split("T")[0]).length}</p>
//         </div>
//         <div className="bg-green-100 text-green-900 rounded-lg p-4 shadow">
//           <p className="font-bold text-lg">Total Items Delivered</p>
//           <p className="text-2xl">{totalItems}</p>
//         </div>
//         <div className="bg-yellow-100 text-yellow-900 rounded-lg p-4 shadow">
//           <p className="font-bold text-lg">Total Earnings</p>
//           <p className="text-2xl">Rs. {totalCost}</p>
//         </div>
//       </div>

//       {/* Order History Chart */}
//       <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-10">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4">Order History</h2>

//         <div className="mb-4 flex gap-4">
//           {["today", "7days", "month"].map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1 rounded ${filter === f ? "bg-blue-500 text-white" : "bg-gray-200"}`}
//             >
//               {f === "today" ? "Today" : f === "7days" ? "Last 7 Days" : "Last Month"}
//             </button>
//           ))}
//         </div>

//         <div className="bg-gray-50 p-4 rounded mb-6">
//           <p className="text-gray-700 mb-1"><strong>Total Items Delivered:</strong> {totalItems}</p>
//           <p className="text-gray-700"><strong>Total Cost of Orders:</strong> Rs. {totalCost}</p>
//         </div>

//         <div className="h-64 relative">
//           {chartData.length === 0 ? (
//             <div className="flex justify-center items-center h-full text-gray-400 text-xl font-semibold">
//               No orders
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData}>
//                 <XAxis dataKey={filter === "month" ? "weekRange" : "date"} />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="items" fill="#60A5FA" name="Items Delivered" />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>
//       </div>

//       {/* Notified Orders */}
//       <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
//         <h3 className="text-xl font-semibold text-green-600 mb-4">Notified Orders</h3>
//         {notifiedOrders.length === 0 ? (
//           <p className="text-gray-500">No notified orders.</p>
//         ) : (
//           notifiedOrders.map((order) => renderOrderCard(order))
//         )}
//       </div>
//     </div>
//   );
// };

// export default DeliveryStaffPage;
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { WSContext } from "../components/Header"; // Adjust path as needed

const DeliveryStaffPage = () => {
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("today");
  const [notifiedOrders, setNotifiedOrders] = useState([]);

  const { user } = useSelector((state) => state.authState);
  const location = useLocation();
  const ws = useContext(WSContext);

  const orderHistory = [
    { date: "2025-06-30", items: 10, cost: 2500 },
    { date: "2025-06-29", items: 8, cost: 2000 },
    { date: "2025-06-28", items: 6, cost: 1500 },
    { date: "2025-06-27", items: 12, cost: 3000 },
    { date: "2025-06-26", items: 9, cost: 2200 },
    { date: "2025-06-25", items: 11, cost: 2750 },
    { date: "2025-06-24", items: 7, cost: 1800 },
  ];

  // Fetch staff data
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/user/deliveryStaff/${user._id}`);
        setStaffData(response.data);
      } catch (error) {
        console.error("Failed to fetch delivery staff data:", error);
        setStaffData({
          name: user.name,
          email: user.email,
          mobile: "0770000000",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchStaffData();
  }, [user]);

  // Register staff & handle orders from WebSocket (context)
  useEffect(() => {
    if (!ws || !user?._id) return;

    if (ws.readyState === 1) {
      ws.send(JSON.stringify({ type: 'register_staff', staffId: user._id }));
      console.log("WebSocket registered from DeliveryStaffPage:", user._id);
    } else {
      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'register_staff', staffId: user._id }));
        console.log("WebSocket registered (onopen):", user._id);
      };
    }

    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_order") {
        console.log("Received new_order:", data.order);
        setNotifiedOrders((prev) => [data.order, ...prev]);
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => ws.removeEventListener("message", handleMessage);
  }, [ws, user?._id]);

  // Get notified order from NotificationIcon (via navigation state)
  useEffect(() => {
    const stateOrder = location?.state?.notifiedOrder;
    if (stateOrder) {
      setNotifiedOrders((prev) => [stateOrder, ...prev]);
    }
  }, [location]);

  const handleAccept = (orderId) => {
    console.log(`Accepted order: ${orderId}`);
    // Optional: send to backend
  };

  const handleReject = (orderId) => {
    console.log(`Rejected order: ${orderId}`);
    // Optional: send to backend
  };

  const renderOrderCard = (order) => (
    <div key={order._id || order.orderId} className="border-b border-gray-200 pb-4 mb-6">
      <div className="flex items-center text-sm text-gray-600 mb-1">
        <FaMapMarkerAlt className="text-red-500 mr-2" />
        {order.address || "Unknown Address"}
      </div>
      <p><strong>Order ID:</strong> {order.orderId}</p>
      <p><strong>Phone:</strong> {order.phoneNo}</p>
      <p><strong>City:</strong> {order.city}</p>
      <p><strong>Items:</strong> {order.orderItems?.map(i => i.name).join(", ")}</p>
      <p><strong>Total:</strong> Rs. {order.totalPrice}</p>
      <p className="text-xs text-gray-400 mt-1 mb-2">Status: {order.status}</p>

      <div className="flex gap-3">
        <button
          onClick={() => handleAccept(order.orderId)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
        >
          Accept
        </button>
        <button
          onClick={() => handleReject(order.orderId)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
        >
          Reject
        </button>
      </div>
    </div>
  );

  const filterData = () => {
    const now = new Date();
    return orderHistory.filter((entry) => {
      const orderDate = new Date(entry.date);
      const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
      if (filter === "today") return diffDays < 1;
      if (filter === "7days") return diffDays <= 7;
      if (filter === "month") return diffDays <= 30;
      return true;
    });
  };

  const getWeeklySummaries = (data) => {
    const weeks = {};
    data.forEach((entry) => {
      const date = new Date(entry.date);
      const monday = new Date(date);
      monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const key = `${monday.toISOString().split("T")[0]}_${sunday.toISOString().split("T")[0]}`;
      const label = `${monday.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${sunday.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

      if (!weeks[key]) {
        weeks[key] = { weekRange: label, items: 0, cost: 0 };
      }

      weeks[key].items += entry.items;
      weeks[key].cost += entry.cost;
    });

    return Object.values(weeks);
  };

  const filteredOrders = filterData();
  const totalItems = filteredOrders.reduce((sum, o) => sum + o.items, 0);
  const totalCost = filteredOrders.reduce((sum, o) => sum + o.cost, 0);
  const chartData = filter === "month" ? getWeeklySummaries(filteredOrders) : filteredOrders;

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  if (!staffData) return <div className="text-center mt-10 text-red-500">Staff not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">

      {/* Staff Profile */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Staff Profile</h2>
        <p><strong>Name:</strong> {staffData.name || "N/A"}</p>
        <p><strong>Mobile:</strong> {staffData.mobile || "N/A"}</p>
        <p><strong>Email:</strong> {staffData.email || "N/A"}</p>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="bg-blue-100 text-blue-900 rounded-lg p-4 shadow">
          <p className="font-bold text-lg">Orders Today</p>
          <p className="text-2xl">{filteredOrders.filter(o => o.date === new Date().toISOString().split("T")[0]).length}</p>
        </div>
        <div className="bg-green-100 text-green-900 rounded-lg p-4 shadow">
          <p className="font-bold text-lg">Total Items Delivered</p>
          <p className="text-2xl">{totalItems}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-900 rounded-lg p-4 shadow">
          <p className="font-bold text-lg">Total Earnings</p>
          <p className="text-2xl">Rs. {totalCost}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order History</h2>
        <div className="mb-4 flex gap-4">
          {["today", "7days", "month"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded ${filter === f ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {f === "today" ? "Today" : f === "7days" ? "Last 7 Days" : "Last Month"}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 p-4 rounded mb-6">
          <p className="text-gray-700 mb-1"><strong>Total Items Delivered:</strong> {totalItems}</p>
          <p className="text-gray-700"><strong>Total Cost of Orders:</strong> Rs. {totalCost}</p>
        </div>
        <div className="h-64 relative">
          {chartData.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-400 text-xl font-semibold">
              No orders
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey={filter === "month" ? "weekRange" : "date"} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="items" fill="#60A5FA" name="Items Delivered" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Notified Orders */}
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-green-600 mb-4">Notified Orders</h3>
        {notifiedOrders.length === 0 ? (
          <p className="text-gray-500">No notified orders.</p>
        ) : (
          notifiedOrders.map((order) => renderOrderCard(order))
        )}
      </div>
    </div>
  );
};

export default DeliveryStaffPage;
