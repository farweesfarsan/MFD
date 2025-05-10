import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaProductHunt,
  FaClipboardList,
  FaPlus,
  FaShoppingBasket,
  FaUsers,
  FaStar,
  FaChevronDown
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-full">
      <nav className="p-4">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-gray-800 transition"
            >
              <FaTachometerAlt />
              Dashboard
            </Link>
          </li>

          {/* Products Dropdown */}
          <li>
            <details className="group">
              <summary className="flex items-center justify-between p-2 cursor-pointer rounded hover:bg-white hover:text-gray-800 transition list-none">
                <span className="flex items-center gap-2">
                  <FaProductHunt />
                  Products
                </span>
                <FaChevronDown className="transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <button
                    onClick={() => navigate('/admin/products')}
                    className="flex items-center gap-2 p-2 rounded w-full text-left hover:bg-white hover:text-gray-800 transition"
                  >
                    <FaClipboardList />
                    All
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/admin/products/new')}
                    className="flex items-center gap-2 p-2 rounded w-full text-left hover:bg-white hover:text-gray-800 transition"
                  >
                    <FaPlus />
                    Create
                  </button>
                </li>
              </ul>
            </details>
          </li>

          {/* Orders */}
          <li>
            <Link
              to="/admin/orders"
              className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-gray-800 transition"
            >
              <FaShoppingBasket />
              Orders
            </Link>
          </li>

          {/* Users */}
          <li>
            <Link
              to="/admin/users"
              className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-gray-800 transition"
            >
              <FaUsers />
              Users
            </Link>
          </li>

          {/* Reviews */}
          <li>
            <Link
              to="/admin/reviews"
              className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-gray-800 transition"
            >
              <FaStar />
              Reviews
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
