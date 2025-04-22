import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  decreaseCartItemQty,
  increaseCartItemQty,
  removeItemFromCart,
} from "../../slices/cartSlice";
import { FaRegTrashCan } from "react-icons/fa6";

const Cart = () => {
  const { items } = useSelector((state) => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const increaseQty = (item) => {
    if (item.stock === 0 || item.quantity >= item.stock) return;
    dispatch(increaseCartItemQty(item.product));
  };

  const decreaseQty = (item) => {
    if (item.quantity === 1) return;
    dispatch(decreaseCartItemQty(item.product));
  };

  const checkoutHandler = () =>{
    navigate('/login?redirect=delivery');
  }

  return (
    <Fragment>
      {items.length === 0 ? (
        <h2 className="mt-5 text-center text-xl font-semibold">Your Cart is Empty</h2>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Your Cart: <span className="text-blue-700">{items.length} items</span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3 space-y-4">
            {items.map((item) => (
  <div
    key={item.product}
    className="bg-white border rounded-lg p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between"
  >
    {/* Left Side: Image and Name stacked */}
    <div className="flex flex-col items-center lg:items-start lg:w-1/2">
      <img
        src={item.image}
        alt={item.name}
        className="w-28 h-28 object-cover rounded mb-2"
      />
      <Link
        to={`/products/${item.product}`}
        className="text-indigo-600 hover:underline text-base font-medium text-center lg:text-left"
      >
        {item.name}
      </Link>
    </div>

    {/* Right Side: Price, -, Qty, +, Trash */}
    <div className="flex items-center gap-3 mt-4 lg:mt-0 lg:ml-auto">
      <div className="text-sm font-semibold text-gray-700">
        ${item.price}
      </div>

      <button
        onClick={() => decreaseQty(item)}
        className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded text-sm"
      >
        -
      </button>

      <input
        type="number"
        value={item.quantity}
        readOnly
        className="w-12 text-center border border-gray-300 rounded text-sm"
      />

      <button
        onClick={() => increaseQty(item)}
        className="bg-blue-400 hover:bg-blue-500 text-white px-2 py-1 rounded text-sm"
      >
        +
      </button>

      <button
        onClick={() => dispatch(removeItemFromCart(item.product))}
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
      >
        <FaRegTrashCan />
      </button>
    </div>
  </div>
))}


            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Order Summary</h4>
                <hr className="mb-2" />
                <p className="mb-1 text-gray-600 text-sm">
                  Subtotal:{" "}
                  <span className="font-semibold text-gray-800">
                    {items.reduce((acc, item) => acc + item.quantity, 0)} (Units)
                  </span>
                </p>
                <p className="mb-2 text-gray-600 text-sm">
                  Est. total:{" "}
                  <span className="font-semibold text-gray-800">
                    $
                    {items
                      .reduce((acc, item) => acc + item.quantity * item.price, 0)
                      .toFixed(2)}
                  </span>
                </p>
                <hr className="mb-2" />
                <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded mt-2 text-sm" onClick={checkoutHandler}>
                  Check out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Cart;
