import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProducts } from "../../actions/productsActions";
import { Menu } from "lucide-react"; // optional: use heroicons or any icon

const Dashboard = () => {
  const { products = [] } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    dispatch(getAdminProducts);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div
        className={`fixed md:static z-40 bg-white md:bg-transparent w-64 md:w-1/4 h-full transform ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:w-3/4 md:ml-0">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Total Amount */}
        <div className="mb-6">
          <div className="bg-blue-600 text-white rounded shadow p-6 text-center text-xl font-medium">
            Total Amount
            <br />
            <b className="text-2xl block mt-2">$3425</b>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Products Card */}
          <SummaryCard
            title="Products"
            count={23}
            link="/admin/products"
            bgColor="bg-green-600"
          />

          {/* Orders Card */}
          <SummaryCard
            title="Orders"
            count={345}
            link="/admin/orders"
            bgColor="bg-red-600"
          />

          {/* Users Card */}
          <SummaryCard
            title="Users"
            count={55}
            link="/admin/users"
            bgColor="bg-sky-500"
          />

          {/* Out of Stock Card */}
          <div className="bg-yellow-500 text-white rounded shadow flex flex-col justify-between h-40 p-4">
            <div className="text-center text-lg">
              Out of Stock
              <br />
              <b className="text-xl block mt-2">10</b>
            </div>
            <div className="text-white text-sm mt-auto flex justify-between items-center">
              <span className="invisible">View Details</span>
              <span className="invisible text-lg">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, count, link, bgColor }) => (
  <div className={`${bgColor} text-white rounded shadow flex flex-col justify-between h-40 p-4`}>
    <div className="text-center text-lg">
      {title}
      <br />
      <b className="text-xl block mt-2">{count}</b>
    </div>
    <Link
      to={link}
      className="text-white text-sm mt-auto flex justify-between items-center hover:underline"
    >
      <span>View Details</span>
      <span className="text-lg">›</span>
    </Link>
  </div>
);

export default Dashboard;
