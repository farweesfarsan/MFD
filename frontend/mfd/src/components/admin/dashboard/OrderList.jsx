import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FcNext, FcPrevious } from "react-icons/fc";
import Pagination from "react-js-pagination";
import { adminOrders, deleteOrder } from "../../../actions/orderActions";
import { clearError, clearOrderDeleted } from "../../../slices/orderSlice";
import { toast } from "react-toastify";
import Sidebar from "../Sidebar";
import { Menu } from "lucide-react";

const OrderList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const resPerPage = 6;

  const {
    adminOrdersData = [],
    loading = true,
    error,
    isOrderDeleted,
  } = useSelector((state) => state.orderState);

  useEffect(() => {
    if (error) {
      toast(error, {
        position: "bottom-center",
        theme: "dark",
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
    }

    if (isOrderDeleted) {
      toast.success("Order deleted successfully", {
        position: "bottom-center",
        theme: "dark",
      });
      dispatch(clearOrderDeleted());
      dispatch(adminOrders());
    }

    dispatch(adminOrders());
  }, [dispatch, error, isOrderDeleted]);

  const handleDelete = (orderId) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
            <h1 className="text-xl font-semibold mb-4">Confirm to delete</h1>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this order?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  dispatch(deleteOrder(orderId));
                  onClose();
                }}
                className="bg-gray-900 text-white px-5 py-2 rounded-md hover:bg-black transition"
              >
                Yes
              </button>
              <button
                onClick={onClose}
                className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-600 transition"
              >
                No
              </button>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <div className="flex min-h-screen relative">
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
      <div className="w-full p-4 md:pl-8 md:ml-64">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Order List</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading orders...</div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-start text-xs font-medium text-white uppercase hidden md:table-cell min-w-[150px]">
                      ID
                    </th>
                    <th className="px-4 py-2 text-start text-xs font-medium text-white uppercase min-w-[150px]">
                      Name
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase min-w-[100px]">
                      Price
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase min-w-[100px]">
                      Status
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase min-w-[120px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminOrdersData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-6 text-center text-gray-500 text-sm"
                      >
                        No Orders Found
                      </td>
                    </tr>
                  ) : (
                    [...adminOrdersData]
                      .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      ) // Newest first
                      .slice(
                        (currentPage - 1) * resPerPage,
                        currentPage * resPerPage
                      )
                      .map((order) => (
                        <tr key={order._id}>
                          <td className="px-4 py-2 text-start whitespace-nowrap text-gray-800 hidden md:table-cell">
                            {order._id}
                          </td>
                          <td className="px-4 py-2 text-start whitespace-nowrap text-gray-800">
                            {order.orderItems.length}
                          </td>
                          <td className="px-4 py-2 text-center whitespace-nowrap text-gray-800">
                            Rs.{order.finalPrice}
                          </td>
                          <td className="px-4 py-2 text-center whitespace-nowrap text-gray-800">
                            {order.orderStatus}
                          </td>
                          <td className="px-4 py-2 text-center whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              <Link
                                to={`/admin/order/${order._id}`}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(order._id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {adminOrdersData.length > resPerPage && (
              <div className="flex justify-center mt-4">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resPerPage}
                  totalItemsCount={adminOrdersData.length}
                  onChange={(pageNumber) => setCurrentPage(pageNumber)}
                  nextPageText={<FcNext className="w-6 h-6" />}
                  prevPageText={<FcPrevious className="w-6 h-6" />}
                  innerClass="flex gap-2 items-center justify-center bg-white rounded-lg shadow-md px-4 py-2 max-w-full overflow-hidden"
                  itemClass="px-3 py-1 text-gray-700 bg-white border rounded-md cursor-pointer transition duration-200 ease-in-out hover:bg-[#43c2be] hover:text-white"
                  activeClass="bg-blue-600 text-white font-semibold"
                  linkClass="block w-full h-full"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;
