import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProducts } from "../../../actions/productsActions";
import { getAllUsers} from "../../../actions/usersActions";
import { adminOrders } from "../../../actions/orderActions";
import { Menu } from "lucide-react";
import { MdBarChart } from "react-icons/md";
import { PiUsersThreeFill } from "react-icons/pi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const { products = [] } = useSelector((state) => state.productsState);
  const { adminOrdersData = [], totalamount = 0 } = useSelector(
    (state) => state.orderState
  );
  const { users = [] } = useSelector((state) => state.userState);
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);

  let outOfStock = 0;
  if (products.length > 0) {
    products.forEach((product) => {
      if (product.stock === 0) {
        outOfStock++;
      }
    });
  }

  const userRoleCount = users.reduce((acc,user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const userChartData = Object.keys(userRoleCount).map((role)=>({
    name: role.charAt(0).toUpperCase() + role.slice(1),
    value: userRoleCount[role],
  }))

  const COLORS = ["#4f46e5", "#22c55e", "#f97316", "#ef4444"];

  useEffect(() => {
    dispatch(getAllUsers);
    dispatch(getAdminProducts());
    dispatch(adminOrders());
  }, [dispatch]);

  // Date Helpers
  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const isLast7Days = (date) => {
    const d = new Date(date);
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    return d >= sevenDaysAgo && d <= today;
  };

  const isLast30Days = (date) => {
    const d = new Date(date);
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return d >= thirtyDaysAgo && d <= today;
  };

  // Orders by timeframe
  const todayOrders = adminOrdersData.filter((o) => isToday(o.createdAt)).length;
  const weekOrders = adminOrdersData.filter((o) => isLast7Days(o.createdAt)).length;
  const monthOrders = adminOrdersData.filter((o) => isLast30Days(o.createdAt)).length;

  const chartData = [
    { name: "Today", Orders: todayOrders },
    { name: "Last 7 Days", Orders: weekOrders },
    { name: "Last 30 Days", Orders: monthOrders },
  ];

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar (Desktop) */}
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
      <div className="flex-1 p-4 md:ml-64">
        {/* Header */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Total Amount */}
        <div className="mb-6">
  <div className="bg-blue-600 text-white rounded shadow flex flex-col justify-between h-40 p-4">
    <div className="text-center text-lg">
      Total Orders Value
      <br />
      <b className="text-2xl block mt-2">
        Rs.{totalamount.toLocaleString()}
      </b>
    </div>
    <Link
      to="/admin/revenueReport"
      className="text-white text-sm mt-auto flex justify-between items-center hover:underline"
    >
      <span>View Report</span>
      <span className="text-lg">›</span>
    </Link>
  </div>
</div>


       {/* Charts Section (Order Performance + User Roles) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  {/* Order Bar Chart */}
  <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-center gap-2 mb-4">
      <MdBarChart className="text-indigo-600 w-6 h-6" />
      <h2 className="text-lg font-semibold text-indigo-600">Order Performance</h2>
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="Orders" fill="#4f46e5" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* User Role Pie Chart */}
  <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-center gap-2 mb-4">
      <PiUsersThreeFill className="text-green-600 w-6 h-6" />
      <h2 className="text-lg font-semibold text-green-600">User Role Distribution</h2>
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={userChartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {userChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={36} />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>




        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Products"
            count={products.length}
            link="/admin/productReport"
            bgColor="bg-green-600"
          />
          <SummaryCard
            title="Orders"
            count={adminOrdersData.length}
            link="/admin/orderReport"
            bgColor="bg-red-600"
          />
          <SummaryCard
            title="Users"
            count={users.length}
            link="/admin/userReport"
            bgColor="bg-sky-500"
          />
          <div className="bg-yellow-500 text-white rounded shadow flex flex-col justify-between h-40 p-4">
            <div className="text-center text-lg">
              Out of Stock
              <br />
              <b className="text-xl block mt-2">{outOfStock}</b>
            </div>
            <div className="text-white text-sm mt-auto flex justify-between items-center">
              <span className="invisible">View Report</span>
              <span className="invisible text-lg">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, count, link, bgColor }) => (
  <div
    className={`${bgColor} text-white rounded shadow flex flex-col justify-between h-40 p-4`}
  >
    <div className="text-center text-lg">
      {title}
      <br />
      <b className="text-xl block mt-2">{count}</b>
    </div>
    <Link
      to={link}
      className="text-white text-sm mt-auto flex justify-between items-center hover:underline"
    >
      <span>View Report</span>
      <span className="text-lg">›</span>
    </Link>
  </div>
);

export default Dashboard;
