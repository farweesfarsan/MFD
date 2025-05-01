import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

// Step Button Component
const Step = ({ label, active, completed, to, onClick }) => {
  const navigate = useNavigate();
  const bgColor = completed
    ? 'bg-green-500 text-white'
    : active
    ? 'bg-blue-500 text-white'
    : 'bg-gray-300 text-gray-600';

  const handleClick = () => {
    if (onClick) {
      const shouldNavigate = onClick();
      if (shouldNavigate) {
        navigate(to);
      }
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={classNames(
        'relative px-6 py-3 text-sm font-semibold clip-arrow transition-all duration-300 shadow-sm',
        bgColor
      )}
    >
      {label}
    </button>
  );
};

// Main Checkout Steps Component
const CheckoutSteps = ({ delivery, confirmOrder, payment }) => {
  const { deliveryInfo } = useSelector((state) => state.cartState);

  const validateBeforeGoToDelivery = () => {
    if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.phoneNo) {
      toast.error('Please complete delivery information before navigating.');
      return false;
    }
    return true;
  };

  return (
    <div className="flex items-center justify-center mt-10 gap-x-4">
      <Step
        label="Delivery"
        to="/delivery"
        completed={delivery}
        active={!confirmOrder && !payment}
        onClick={validateBeforeGoToDelivery}
      />
      <Step
  label="Confirm Order"
  to="/order/confirm"
  completed={confirmOrder}
  active={!payment && confirmOrder}
  onClick={() => {
    if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.phoneNo) {
      return false;
    }
    return true;
  }}
/>

<Step
  label="Payment"
  to="/payment"
  completed={payment}
  active={payment}
  onClick={() => {
    if (!deliveryInfo.address || !deliveryInfo.city || !deliveryInfo.phoneNo) {
      return false;
    }
    return true;
  }}
/>

    </div>
  );
};

export default CheckoutSteps;

