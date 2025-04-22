
import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../actions/productActions";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import Loader from "../layouts/Loader";
import Metadata from "../layouts/Metadata";
import { addCartItem } from "../../actions/cartActions";
import { createReview } from "../../actions/productActions";
import ProductReview from "./productReview";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { product, loading } = useSelector(state => state.productState);
  const { user } = useSelector(state => state.authState);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(getProduct(id));
  }, [dispatch, id]);

  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleCreateReview = () => {
    if (rating > 0 && comment) {
      dispatch(createReview({ productId: id, rating, comment }));
      setComment("");
      setRating(0);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQty = () => {
    if (quantity < product?.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Custom Rating component to handle star display
  const Rating = ({ rating }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className="focus:outline-none"
            onClick={() => handleStarClick(star)}
          >
            {rating >= star ? (
              <FaStar className="text-yellow-500" />
            ) : (
              <FaRegStar className="text-gray-400" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Metadata title={product?.name} />
          <div className="container mx-auto my-10 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col items-center">
                <div className="border-4 border-[#17415e] rounded-lg p-2 shadow-lg w-72 md:w-80 lg:w-96 mt-6">
                  <img
                    id="product_image"
                    src={
                      product?.images && product.images.length > 0
                        ? product.images[0].image
                        : "/path/to/placeholder.jpg" // Fallback to a placeholder image
                    }
                    alt={product?.name}
                    className="w-full h-auto object-contain rounded-md"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-semibold text-gray-900">{product?.name}</h2>
                <p id="product_id" className="text-sm text-gray-500">
                  Product ID: #{product?._id}
                </p>
                <hr />
                <div className="flex items-center my-2">
                  <Rating rating={parseFloat(product?.ratings)} />
                  <span id="no_of_reviews" className="ml-2 text-sm text-gray-500">
                    ({product?.numOfReviews} Reviews)
                  </span>
                </div>
                <hr />
                <p id="product_price" className="text-3xl font-bold text-gray-800">
                  Rs. {product?.price}
                </p>

                <div className="flex items-center gap-4 mt-4">
                  <button
                    className="minus bg-gray-300 px-3 py-2 rounded-md"
                    onClick={decreaseQty}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="stockCounter border w-14 text-center py-1 rounded-md"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="plus bg-gray-300 px-3 py-2 rounded-md"
                    onClick={increaseQty}
                  >
                    +
                  </button>
                  <button
                    id="cart_btn"
                    className={`py-2 px-6 rounded-full text-lg font-semibold text-white ${
                      product?.stock === 0
                        ? "cursor-not-allowed bg-yellow-200"
                        : "bg-yellow-500"
                    }`}
                    onClick={() => dispatch(addCartItem(product._id, quantity))}
                  >
                    Add to Cart
                  </button>
                </div>

                <hr className="mt-4" />
                <p className="text-lg font-semibold flex items-center mt-2">
                  Status:
                  <span
                    id="stock_status"
                    className={`ml-2 font-bold ${
                      product?.stock > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {product?.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </p>

                <hr />
                <div>
                  <p className="text-lg font-semibold mt-2">Description</p>
                  <p>{product?.description}</p>
                </div>

                <hr />
                <div className="mt-12">
                  {user ? (
                    <button
                      id="review_btn"
                      className="mt-4 bg-yellow-500 text-white py-2 px-8 rounded-full text-lg font-semibold"
                      onClick={() => setShowReviewModal(true)}
                    >
                      Write a Review
                    </button>
                  ) : (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-800 px-6 py-3 rounded-lg text-center text-sm font-medium shadow-sm w-fit">
                      Please <span className="font-semibold">login</span> to post a review.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {showReviewModal && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className="text-2xl focus:outline-none"
                    >
                      {rating >= star ? (
                        <FaStar
                          className={`${
                            rating === star ? "text-yellow-600" : "text-yellow-500"
                          }`}
                        />
                      ) : (
                        <FaRegStar className="text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>

                <textarea
                  className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-[#43c2be] outline-none"
                  rows="4"
                  placeholder="Write your review here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleCreateReview();
                      setShowReviewModal(false);
                      window.location.reload();
                    }}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {product?.reviews && product.reviews.length > 0 ? (
            <div className="w-full mt-10">
              <ProductReview reviews={product.reviews} />
            </div>
          ) : (
            <p>No reviews available.</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
