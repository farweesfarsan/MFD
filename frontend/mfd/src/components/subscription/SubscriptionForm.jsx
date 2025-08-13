import React, { useState } from "react";
import { createSubscriptionAction } from "../../actions/subscriptionActions";
import { useDispatch, useSelector } from "react-redux";

const SubscriptionForm = ({ user: userProp }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authState);
  const { deliveryInfo } = useSelector((state) => state.cartState);

  const userData = user || userProp; // fallback to prop if Redux user not available

  const [formData, setFormData] = useState({
    planeName: "",
    amount: "",
    frequency: "",
    duration: "",
    first_name: userData?.name?.split(" ")[0] || "",
    last_name: userData?.name?.split(" ")[1] || "",
    email: userData?.email || "",
    phone: deliveryInfo?.phoneNo || "",
    address: deliveryInfo?.address || "",
    city: deliveryInfo?.city || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, userId: userData._id };

    try {
      const response = await dispatch(createSubscriptionAction(payload));
      if (response?.formData) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://sandbox.payhere.lk/pay/subscription";

        Object.entries(response.formData).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form JSX fields go here */}
    </form>
  );
};

export default SubscriptionForm;

