import React, { useState, useRef } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { useSelector } from 'react-redux';
import { Menu } from 'lucide-react';
import { MdOutlineInventory2 } from 'react-icons/md';
import html2pdf from 'html2pdf.js';
import MFD_LOGO from '../../assets/MLF_SMALL_LOGO.webp';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const OrderReport = () => {
  const { adminOrdersData = [], totalamount = 0 } = useSelector((state) => state.orderState);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [lastPublishedDateTime, setLastPublishedDateTime] = useState(null);
  const [filterRange, setFilterRange] = useState([null, null]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [startDate, endDate] = filterRange;
  const reportRef = useRef(null);

  const getFormattedDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getFormattedTime = (date) =>
    new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const handleDownloadPDF = () => {
    const now = new Date();
    const today = getFormattedDate(now);
    const time = getFormattedTime(now);

    setIsPdfMode(true);
    setTimeout(() => {
      const element = reportRef.current;
      const opt = {
        margin: 0.5,
        filename: `Order_Report_${today}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          setLastPublishedDateTime({ date: today, time });
          setIsPdfMode(false);
        });
    }, 100);
  };

  const filteredOrders = adminOrdersData.filter((order) => {
    const orderDate = new Date(order.createdAt);

    const isInDateRange =
      (!startDate || !endDate) || (orderDate >= startDate && orderDate <= endDate);

    const isStatusMatch =
      selectedStatus === "All" || order.orderStatus === selectedStatus;

    return isInDateRange && isStatusMatch;
  });

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <div className="hidden md:block w-64 bg-gray-800 absolute top-0 bottom-0">
        <Sidebar />
      </div>

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

      <div className="flex-1 p-6 md:ml-64 w-full">
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Order Report</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 grid sm:grid-cols-2 gap-4 text-center">
          {/* Date Filter */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Filter by Date Range:
            </label>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setFilterRange(update)}
              isClearable={true}
              className="border rounded px-4 py-2 w-full"
              placeholderText="Select date range"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Filter by Order Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded px-4 py-2 w-full"
            >
              <option value="All">All</option>
              <option value="Delivered">Delivered</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div ref={reportRef} className="px-4">
          {isPdfMode && (
            <div className="flex justify-center mb-4">
              <img src={MFD_LOGO} alt="MFD Logo" className="h-16" />
            </div>
          )}

          <div className="text-center mb-8">
            {!isPdfMode && (
              <div className="flex justify-center items-center gap-3 mb-2">
                <MdOutlineInventory2 className="text-4xl text-[#38bdf8]" />
              </div>
            )}
            <h1
              className={`text-4xl font-bold ${
                isPdfMode ? 'text-blue-800' : 'text-transparent bg-clip-text'
              }`}
              style={
                isPdfMode
                  ? {}
                  : {
                      fontFamily: "'Segoe UI', Roboto, sans-serif",
                      background: 'linear-gradient(90deg, #0066ff, #00ccff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }
              }
            >
              Orders Report
            </h1>
            <p className="text-[#174e64]">Insight into recent order activity</p>
          </div>

          <div className="bg-white px-4 py-3 rounded-md text-md mb-10 shadow-sm text-center">
            {isPdfMode ? (
              <>
                <p className="text-red-600 font-medium">
                  Date: {getFormattedDate(new Date())}
                </p>
                <p className="text-gray-600 text-sm">
                  Report published at: {getFormattedTime(new Date())}
                </p>
              </>
            ) : lastPublishedDateTime ? (
              <>
                <p className="text-red-600 font-medium">
                  Last Published Date: {lastPublishedDateTime.date}
                </p>
                <p className="text-gray-600 text-sm">
                  Last Published Time: {lastPublishedDateTime.time}
                </p>
              </>
            ) : (
              <p className="text-gray-500 italic">No report published yet.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mb-10 mx-auto">
            <div className="bg-white shadow-md rounded-2xl p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-700">Total Orders</h2>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {filteredOrders.length}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6 text-center">
              <h2 className="text-lg font-semibold text-gray-700">Total Orders Value</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                Rs. {filteredOrders.reduce((acc, o) => acc + o.totalPrice, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-5xl mx-auto">
            <h2
              className={`text-2xl font-semibold text-center mb-4 ${
                isPdfMode ? 'text-gray-800' : 'text-transparent bg-clip-text'
              }`}
              style={
                isPdfMode
                  ? {}
                  : {
                      fontFamily: "'Segoe UI', Roboto, sans-serif",
                      background: 'linear-gradient(90deg, #0f172a, #38bdf8)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }
              }
            >
              Recent Orders
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="border p-3 text-left">Order ID</th>
                    <th className="border p-3 text-left">Status</th>
                    <th className="border p-3 text-left">Amount</th>
                    <th className="border p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center p-4 text-gray-500">
                        No orders available for selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="border p-3">{order._id}</td>
                        <td className="border p-3 capitalize">{order.orderStatus}</td>
                        <td className="border p-3">Rs. {order.totalPrice}</td>
                        <td className="border p-3">
                          {getFormattedDate(order.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReport;
