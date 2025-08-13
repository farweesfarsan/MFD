import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { adminOrders } from "../../actions/orderActions";
import Sidebar from "../../components/admin/Sidebar";
import { Menu } from "lucide-react";
import html2pdf from "html2pdf.js";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const RevenueReport = () => {
  const dispatch = useDispatch();
  const reportRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [lastPublishedDateTime, setLastPublishedDateTime] = useState(null);

  const { adminOrdersData = [], loading } = useSelector((state) => state.orderState);

  useEffect(() => {
    dispatch(adminOrders());
  }, [dispatch]);

  // Filter delivered orders
  const deliveredOrders = adminOrdersData.filter(
    (order) => order.orderStatus === "Delivered"
  );

  // Helper dates
  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  // Calculate revenue for last week and last month
  const lastWeekRevenue = deliveredOrders
    .filter((order) => new Date(order.createdAt) >= oneWeekAgo)
    .reduce((acc, order) => acc + Number(order.finalPrice), 0);

  const lastMonthRevenue = deliveredOrders
    .filter((order) => new Date(order.createdAt) >= oneMonthAgo)
    .reduce((acc, order) => acc + Number(order.finalPrice), 0);

  // Total revenue (already calculated)
  const totalRevenue = deliveredOrders.reduce(
    (acc, order) => acc + Number(order.finalPrice),
    0
  );

  // Prepare monthly revenue for last 12 months for chart
  const monthlyRevenueMap = {};

  // Initialize last 12 months keys with 0 revenue
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleString("default", { month: "short", year: "numeric" }); // e.g. "Jul 2025"
    monthlyRevenueMap[key] = 0;
  }

  deliveredOrders.forEach((order) => {
    const date = new Date(order.createdAt);
    const key = date.toLocaleString("default", { month: "short", year: "numeric" });
    if (key in monthlyRevenueMap) {
      monthlyRevenueMap[key] += Number(order.finalPrice);
    }
  });

  const monthlyRevenueData = Object.entries(monthlyRevenueMap).map(([name, value]) => ({
    name,
    Revenue: value,
  }));

  // Date formatting for PDF filename & display
  const getFormattedDate = (date) =>
    date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getFormattedTime = (date) =>
    date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  // PDF download handler
  const handleDownloadPDF = () => {
    const nowDate = new Date();
    const today = getFormattedDate(nowDate);
    const time = getFormattedTime(nowDate);

    setIsPdfMode(true);
    setTimeout(() => {
      const element = reportRef.current;
      const opt = {
        margin: 0.5,
        filename: `Revenue_Report_${today}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
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

  return (
    <div className="flex min-h-screen relative bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-gray-800 absolute top-0 bottom-0">
        <div className="sticky top-0 min-h-screen">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar */}
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
      <div className="flex-1 p-6 md:ml-64 w-full">
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">Revenue Report</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Download Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Download PDF
          </button>
        </div>

        {/* Report Content */}
        <div
          ref={reportRef}
          className="bg-white rounded shadow p-6 overflow-auto"
          style={{ minHeight: "80vh" }}
        >
          {/* PDF Mode Header */}
          {isPdfMode && (
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-blue-800">Order Revenue Report</h1>
            </div>
          )}

          {/* Date & Time */}
          <div className="mb-6 text-center">
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
              <p className="italic text-gray-500">No report published yet.</p>
            )}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-100 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold">Last Week Revenue</h3>
              <p className="text-xl font-bold text-green-700">
                Rs.{lastWeekRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold">Last Month Revenue</h3>
              <p className="text-xl font-bold text-blue-700">
                Rs.{lastMonthRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded shadow text-center">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <p className="text-xl font-bold text-yellow-700">
                Rs.{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Monthly Revenue Bar Chart */}
          <div style={{ width: "100%", height: 350 }}>
            <ResponsiveContainer>
              <BarChart
                data={monthlyRevenueData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `Rs.${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="Revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
