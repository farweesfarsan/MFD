import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAllReviews,
  deleteReviews,
} from "../../../actions/productActions";
import {
  clearError,
  clearReviewDelete,
} from "../../../slices/productSlice";
import Sidebar from "../Sidebar";
import { FcNext, FcPrevious } from "react-icons/fc";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Pagination from "react-js-pagination";

const ReviewList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchProductName, setSearchProductName] = useState("");
  const [searchProductId, setSearchProductId] = useState("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const resPerPage = 6;

  const {
    reviews = [],
    loading,
    error,
    isReviewDeleted,
  } = useSelector((state) => state.productState);

  useEffect(() => {
    dispatch(getAllReviews());
  }, [dispatch]);

  const handleDelete = (reviewId, productIdForReview) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-xl font-semibold mb-4">Confirm to delete</h1>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this review?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                dispatch(deleteReviews(productIdForReview, reviewId));
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
      ),
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsFiltered(true);
  };

  const filteredReviews = reviews.filter((review) => {
    const matchName = review.product?.name
      ?.toLowerCase()
      .includes(searchProductName.toLowerCase());
    const matchId = review.product?._id
      ?.toLowerCase()
      .includes(searchProductId.toLowerCase());

    // If both filters are empty, return all
    if (!isFiltered) return true;

    // If only name is entered
    if (searchProductName && !searchProductId) return matchName;

    // If only ID is entered
    if (!searchProductName && searchProductId) return matchId;

    // If both are entered
    return matchName && matchId;
  });

  const indexOfLast = currentPage * resPerPage;
  const indexOfFirst = indexOfLast - resPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirst, indexOfLast);

  const showingFrom = filteredReviews.length === 0 ? 0 : indexOfFirst + 1;
  const showingTo = Math.min(indexOfLast, filteredReviews.length);
  const totalEntries = filteredReviews.length;

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
        theme: "dark",
        onOpen: () => dispatch(clearError()),
      });
    }

    if (isReviewDeleted) {
      toast.success("Review deleted successfully", {
        position: "bottom-center",
        theme: "dark",
      });
      dispatch(clearReviewDelete());
      dispatch(getAllReviews());
    }
  }, [dispatch, error, isReviewDeleted]);

  return (
    <div className="flex min-h-screen relative">
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

      <div className="w-full p-4 md:pl-8 md:ml-64">
        <div className="md:flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Product Reviews</h1>
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0"
          >
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchProductName}
              onChange={(e) => setSearchProductName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md md:w-64 focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
            {isFiltered && (
              <button
                type="button"
                onClick={() => {
                  setSearchProductName("");
                  setSearchProductId("");
                  setIsFiltered(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Show All
              </button>
            )}
          </form>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading reviews...</div>
        ) : (
          <>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-start text-xs font-medium text-white uppercase">
                      Product Name
                    </th>
                    <th className="px-4 py-2 text-start text-xs font-medium text-white uppercase">
                      Rating
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase">
                      Reviewer
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase">
                      Comment
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentReviews.map((review) => (
                    <tr key={review._id}>
                      <td className="px-4 py-2 text-start text-gray-800">
                        {review.product?.name || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-start text-gray-800">
                        {review.rating}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-800">
                        {review.user?.name || "Anonymous"}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-800">
                        {review.comment}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() =>
                            handleDelete(review._id, review.product?._id)
                          }
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredReviews.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No reviews found.
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4 flex-col md:flex-row">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing {showingFrom} to {showingTo} of {totalEntries} entries
              </div>
            </div>

            {filteredReviews.length > resPerPage && (
              <div className="flex justify-center mt-4">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resPerPage}
                  totalItemsCount={filteredReviews.length}
                  onChange={(pageNumber) => setCurrentPage(pageNumber)}
                  nextPageText={<FcNext className="w-6 h-6" />}
                  prevPageText={<FcPrevious className="w-6 h-6" />}
                  innerClass="flex gap-2 items-center justify-center bg-white rounded-lg shadow-md px-4 py-2"
                  itemClass="px-3 py-1 text-gray-700 bg-white border rounded-md cursor-pointer hover:bg-[#43c2be] hover:text-white"
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

export default ReviewList;
