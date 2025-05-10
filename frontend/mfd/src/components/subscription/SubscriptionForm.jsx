import React, { useState } from "react";
import { createSubscriptionAction } from "../../actions/subscriptionActions";
import { useDispatch, useSelector } from "react-redux";

const SubscriptionForm = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.authState);
    const { deliveryInfo } = useSelector(state => state.cartState);
    const { loading, error } = useSelector(state => state.subscriptionState);
    const [formData, setFormData] = useState({
      planeName: '',
      amount: '',
      frequency: '',
      duration: '',
      first_name: user?.name?.split(" ")[0] || '',
      last_name: user?.name?.split(" ")[1] || '',
      email: user?.email || '',
      phone: deliveryInfo?.phoneNo || '',
      address: deliveryInfo?.address || '',
      city: deliveryInfo?.city || ''
    });
    

    const handleChange = (e)=>{
      setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e)=>{
       e.preventDefault();
       const payload = { ...formData, userId: user._id};

       try {
        const response = await dispatch(createSubscriptionAction(payload));
        if(response?.formData){
           const form = document.createElement('form');
           form.method = 'POST',
           form.action = 'https://sandbox.payhere.lk/pay/subscription';

           Object.entries(response.formData).forEach(([key, value]) => {
               const input = document.createElement('input');
               input.type = 'hidden';
               input.name = key;
               input.value = value;
               form.appendChild(input);
             });
     
             document.body.appendChild(form);
             form.submit();
        }
     } catch (error) {
       console.error('Dispatch failed:', err);
     }
    }

    return(
        <form 
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-4 p-4 bg-white rounded shadow"
        >
            <input name="planeName" placeholder="Plan Name" onChange={handleChange} className="w-full p-2 border" />
          <input name="amount" type="number" placeholder="Amount (LKR)" onChange={handleChange} className="w-full p-2 border" />
          <input name="frequency" placeholder="Recurrence (e.g. 1 Month)" onChange={handleChange} className="w-full p-2 border" />
          <input name="duration" placeholder="Duration (e.g. Forever)" onChange={handleChange} className="w-full p-2 border" />
    
          <input name="first_name" value={formData.first_name} onChange={handleChange} className="w-full p-2 border" />
          <input name="last_name" value={formData.last_name} onChange={handleChange} className="w-full p-2 border" />
          <input name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border" />
          <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border" />
          <input name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border" />
          <input name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border" />
    
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Subscribe'}
          </button>
        </form>
    ) 

};

export default SubscriptionForm;

// import React, { useState } from "react";
// import { createSubscriptionAction } from "../../actions/subscriptionActions";
// import { useDispatch, useSelector } from "react-redux";

// const SubscriptionForm = ({ user: userProp }) => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.authState);
//   const { deliveryInfo } = useSelector((state) => state.cartState);

//   const userData = user || userProp; // fallback to prop if Redux user not available

//   const [formData, setFormData] = useState({
//     planeName: "",
//     amount: "",
//     frequency: "",
//     duration: "",
//     first_name: userData?.name?.split(" ")[0] || "",
//     last_name: userData?.name?.split(" ")[1] || "",
//     email: userData?.email || "",
//     phone: deliveryInfo?.phoneNo || "",
//     address: deliveryInfo?.address || "",
//     city: deliveryInfo?.city || "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const payload = { ...formData, userId: userData._id };

//     try {
//       const response = await dispatch(createSubscriptionAction(payload));
//       if (response?.formData) {
//         const form = document.createElement("form");
//         form.method = "POST";
//         form.action = "https://sandbox.payhere.lk/pay/subscription";

//         Object.entries(response.formData).forEach(([key, value]) => {
//           const input = document.createElement("input");
//           input.type = "hidden";
//           input.name = key;
//           input.value = value;
//           form.appendChild(input);
//         });

//         document.body.appendChild(form);
//         form.submit();
//       }
//     } catch (error) {
//       console.error("Subscription error:", error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Your form JSX fields go here */}
//     </form>
//   );
// };

// export default SubscriptionForm;

