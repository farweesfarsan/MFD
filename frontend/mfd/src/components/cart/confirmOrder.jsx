import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from './checkoutStep';

const ConfirmOrder = () => {
  const { deliveryInfo, items: cartItems } = useSelector(state => state.cartState);
  const { user } = useSelector(state => state.authState);
  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = itemsPrice > 1500 ? 0 : 100;
  const totalPrice = Number(itemsPrice + deliveryCharge).toFixed(2);

  const processPayment = () =>{
    const data = {
      itemsPrice,
      deliveryCharge,
      totalPrice
    }
    sessionStorage.setItem('orderInfo',JSON.stringify(data));
    navigate('/payment')
  }

  useEffect(() => {
    if (!deliveryInfo || !deliveryInfo.address) {
      navigate('/delivery');
    }
  }, [deliveryInfo, navigate]);

  return (
    <Fragment>
      <CheckoutSteps delivery={true} confirmOrder={true} payment={false} />

      <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-6">
        {/* Left - Shipping Info and Cart Items */}
        <div className="w-full lg:w-8/12 bg-white p-6 rounded-xl shadow-md">
          {/* Shipping Info */}
          <h4 className="text-xl font-semibold border-b pb-2 mb-4">Delivery Information</h4>
          <div className="text-sm space-y-2 mb-6">
            <p><span className="font-medium text-gray-700">Name:</span> {user?.name}</p>
            <p><span className="font-medium text-gray-700">Phone:</span> {deliveryInfo?.phoneNo}</p>
            <p><span className="font-medium text-gray-700">Address:</span> {deliveryInfo?.address}, {deliveryInfo?.city}</p>
          </div>

          {/* Cart Items */}
          <h4 className="text-xl font-semibold border-b pb-2 mb-4">Your Cart Items</h4>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center gap-4 border-b pb-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                <div className="flex-1">
                  <Link
                    to={`/products/${item.product}`}
                    className="block text-blue-600 hover:underline font-medium"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.quantity} x ${item.price.toFixed(2)} ={' '}
                    <span className="font-semibold">${(item.quantity * item.price).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h4 className="text-xl font-semibold border-b pb-2 mb-4">Order Summary</h4>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-medium">${deliveryCharge.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <button
              id="checkout_btn"
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
              onClick={processPayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
