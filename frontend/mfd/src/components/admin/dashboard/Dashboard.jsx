import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAdminProducts } from "../../../actions/productsActions";
import { Menu } from "lucide-react";

const Dashboard = () => {
  const { products = [] } = useSelector((state) => state.productsState);
  const dispatch = useDispatch();
  const [showSidebar, setShowSidebar] = useState(false);
  let outOfStock = 0;

  if (products.length > 0) {
    products.forEach((product) => {
      if (product.stock === 0) {
        outOfStock = outOfStock + 1;
      }
    });
  }

  useEffect(() => {
    dispatch(getAdminProducts());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:block w-64 bg-gray-800 absolute top-0 bottom-0">
        <div className="sticky top-0 min-h-screen">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
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
        {/* Mobile Menu Button */}
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
          <div className="bg-blue-600 text-white rounded shadow p-6 text-center text-xl font-medium">
            Total Amount
            <br />
            <b className="text-2xl block mt-2">$3425</b>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Products"
            count={products.length}
            link="/admin/products"
            bgColor="bg-green-600"
          />
          <SummaryCard
            title="Orders"
            count={345}
            link="/admin/orders"
            bgColor="bg-red-600"
          />
          <SummaryCard
            title="Users"
            count={55}
            link="/admin/users"
            bgColor="bg-sky-500"
          />
          <div className="bg-yellow-500 text-white rounded shadow flex flex-col justify-between h-40 p-4">
            <div className="text-center text-lg">
              Out of Stock
              <br />
              <b className="text-xl block mt-2">{outOfStock}</b>
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
      <span>View Details</span>
      <span className="text-lg">›</span>
    </Link>
  </div>
);

export default Dashboard;
