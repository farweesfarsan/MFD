import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import { getAdminProducts } from "../../../actions/productsActions";
import { clearError, clearProductDelete } from "../../../slices/productSlice";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar";
import { FcNext, FcPrevious } from "react-icons/fc";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import { deleteProduct } from "../../../actions/productActions";

const ProductList = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const resPerPage = 6;

  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.productsState);

  const { error: productError, isProductDeleted } = useSelector((state) => state.productState);

  useEffect(() => {
    if (error || productError) {
      toast(error || productError, {
        position: "bottom-center",
        theme:'dark',
        type: "error",
        onOpen: () => dispatch(clearError()),
      });
    }

    if (isProductDeleted) {
      toast.success("Product deleted successfully",{
        position:'bottom-center',
        theme:'dark'
      });
      dispatch(clearProductDelete());
      dispatch(getAdminProducts());
    }

    dispatch(getAdminProducts());
  }, [dispatch, error, productError, isProductDeleted]);

  
  const handleDelete = (productId) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
            <h1 className="text-xl font-semibold mb-4">Confirm to delete</h1>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  dispatch(deleteProduct(productId));
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
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * resPerPage;
  const indexOfFirstProduct = indexOfLastProduct - resPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const showingFrom = filteredProducts.length === 0 ? 0 : indexOfFirstProduct + 1;
  const showingTo = Math.min(indexOfLastProduct, filteredProducts.length);
  const totalEntries = filteredProducts.length;

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
          <h1 className="text-xl font-bold">Product List</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Search bar */}
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading products...</div>
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
                      Stock
                    </th>
                    <th className="px-4 py-2 text-center text-xs font-medium text-white uppercase min-w-[120px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-4 py-2 text-start whitespace-nowrap text-gray-800 hidden md:table-cell">
                        {product._id}
                      </td>
                      <td className="px-4 py-2 text-start whitespace-nowrap text-gray-800">
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-gray-500 md:hidden">
                            ID: {product._id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap text-gray-800">
                        ${product.price}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap text-gray-800">
                        {product.stock}
                      </td>
                      <td className="px-4 py-2 text-center whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/admin/products/${product._id}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No products found.
                </div>
              )}
            </div>

            {/* Entries info */}
            <div className="flex justify-between items-center mt-4 flex-col md:flex-row">
              <div className="text-sm text-gray-700 mb-2 md:mb-0">
                Showing {showingFrom} to {showingTo} of {totalEntries} entries
              </div>
            </div>

            {/* Pagination */}
            {filteredProducts.length > resPerPage && (
              <div className="flex justify-center mt-4">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resPerPage}
                  totalItemsCount={filteredProducts.length}
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

export default ProductList;
