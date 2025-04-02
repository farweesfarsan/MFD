import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../actions/productsActions";
import Metadata from "./layouts/Metadata";
import Loader from "./layouts/Loader";
import Slider from "./Slider";
import Footer from "./Footer";
import Products from "./products/Products";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "react-js-pagination";
import { FcNext, FcPrevious } from "react-icons/fc";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error, productsCount, resperPage } = useSelector((state) => state.productsState);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getProducts("", currentPage)); // Fetch all products initially
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
        autoClose: 5000,
        theme: "dark",
      });
    }
  }, [error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="w-full overflow-hidden">
            <div className="w-full mb-10">
              <Slider />
            </div>

            <Metadata title={"Buy Fresh Dairies"} />
            <section id="products" className="container mx-auto px-4 w-full max-w-full overflow-hidden mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products && products.map((product) => <Products key={product._id} product={product} />)}
              </div>
            </section>

            {productsCount > resperPage && (
              <div className="flex items-center justify-center mt-6 w-full overflow-hidden">
                <Pagination
                  activePage={currentPage}
                  onChange={setCurrentPage}
                  totalItemsCount={productsCount}
                  itemsCountPerPage={resperPage}
                  nextPageText={<FcNext className="text-xl" />}
                  prevPageText={<FcPrevious className="text-xl" />}
                  innerClass="flex gap-2 items-center justify-center bg-white rounded-lg shadow-md px-4 py-2 max-w-full overflow-hidden"
                  itemClass="px-3 py-1 text-gray-700 bg-white border rounded-md cursor-pointer transition duration-200 ease-in-out hover:bg-[#43c2be] hover:text-white"
                  activeClass="bg-blue-600 text-white font-semibold"
                  linkClass="block w-full h-full"
                />
              </div>
            )}
          </div>
          <Footer />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
