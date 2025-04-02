import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productsActions";
import Metadata from "../layouts/Metadata";
import Loader from "../layouts/Loader";
import Products from "../products/Products";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import { FcNext, FcPrevious } from "react-icons/fc";

const ProductSearch = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const { products, loading, error, totalPages, productsCount, resperPage } = useSelector((state) => state.productsState);

  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState(100);
  const [category, setCategory] = useState("");
  const categories = ["Milk", "Curd", "Ice-Cream", "Panneer", "Yoghurt", "Ghee", "Butter", "Yoghurt Drink"];

  useEffect(() => {
    dispatch(getProducts(category ? "" : keyword, currentPage, category));
  }, [dispatch, keyword, currentPage, category]);

  useEffect(() => {
    if (products?.length > 0) {
      const maxPrice = Math.max(...products.map((product) => product.price));
      setPriceRange(maxPrice);
    }
  }, [products]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
        autoClose: 5000,
        theme: "dark",
      });
    }
  }, [error]);

  const filteredProducts = products?.filter((product) => product.price <= priceRange);

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title={"Buy Fresh Dairies"} />

          {/* Filter by Price Section */}
          <div className="container mx-auto mt-10 px-4">
            <div className="w-full bg-white shadow-lg rounded-xl p-5">
              <div className="flex justify-between items-center">
                <h2 className="text-lg text-[#40d8d0] font-bold">Filter by Price</h2>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-48 cursor-pointer"
                  />
                  <span className="text-gray-700 font-medium">${priceRange}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories and Products Grid */}
          <section id="products" className="container mx-auto mt-8 px-16">
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Categories Section */}
              {/* Categories Section */}
<div className="border border-gray-300 rounded-lg p-9 shadow-lg mt-6 w-full md:w-64">
  <ul className="space-y-2">
    {categories.map((cat) => (
      <li
        key={cat}
        className={`cursor-pointer text-center py-2 px-6 w-full rounded-lg font-semibold text-gray-800 bg-white border border-gray-300 transition-all duration-300 ease-in-out hover:bg-gradient-to-r from-[#40d8d0] to-[#20a39e] hover:text-white hover:shadow-xl hover:scale-105 whitespace-nowrap ${
          category === cat
            ? "bg-[#20a39e] text-black border-[#20a39e]"  // Change text color here
            : ""
        }`}
        onClick={() => handleCategoryClick(cat)}
      >
        {cat}
      </li>
    ))}
  </ul>
</div>


              {/* Products Grid */}
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
                {filteredProducts?.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div key={product._id} className="p-4">
                      <Products product={product} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-full">
                    No products found within the selected price range.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Pagination Section */}
          {productsCount > resperPage && (
  <div className="flex items-center justify-center mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12">
    <Pagination
      activePage={currentPage}
      onChange={setCurrentPage}
      totalItemsCount={productsCount}
      itemsCountPerPage={resperPage}
      nextPageText={<FcNext className="text-xl" />}
      prevPageText={<FcPrevious className="text-xl" />}
      innerClass="flex gap-2 items-center justify-center bg-white rounded-lg shadow-md px-4 py-2"
      itemClass="px-3 py-1 text-gray-700 bg-white border rounded-md cursor-pointer transition duration-200 ease-in-out hover:bg-[#43c2be] hover:text-white"
      activeClass="bg-blue-600 text-white font-semibold"
      linkClass="block w-full h-full"
    />
  </div>
)}

          
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductSearch;
