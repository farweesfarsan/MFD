import { Fragment, useState } from 'react';
import Metadata from '../layouts/Metadata';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../../actions/usersActions';
import { resetUpdate } from '../../slices/authSlice';
import Sidebar from '../admin/Sidebar';
import { Menu } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const DeliveryStaff = () => {
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('/images/user.png');
  const [showSidebar, setShowSidebar] = useState(false);
  const { loading } = useSelector(state => state.authState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
    nic: Yup.string().required('NIC is required'),
    mobileNo: Yup.string()
      .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
      .required('Mobile number is required'),
    address: Yup.string().required('Address is required'),
  });

  const handleSubmit = async (values) => {
    if (!navigator.onLine) {
      return toast.error('No internet connection. Please check your network.');
    }

    try {
      await dispatch(sendOtp(values.email));
      toast.success(`Email sent successfully to ${values.email}`);
      dispatch(resetUpdate());

      navigate('/sendOtp', {
        state: {
          userData: values,
          avatar,
          userType: 'deliveryStaff'
        }
      });
    } catch (error) {
      let errorMessage = 'Failed to send OTP. Please try again.';
      if (error.message.includes('Network Error')) {
        errorMessage = 'Network error! Please check your internet connection.';
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;

        if (errorMessage === 'Email already exists') {
          toast.error('This email is already registered. Please use a different email.');
          return;
        }
      }

      toast.error(errorMessage);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Fragment>
      <Metadata title="Register Staff" />
      <div className='flex flex-col md:flex-row min-h-screen bg-gray-100'>
        <div
          className={`z-40 md:relative w-64 transition-transform duration-300 ease-in-out bg-gray-800 text-white ${
            showSidebar ? "absolute top-0 left-0 translate-x-0" : "absolute -translate-x-full"
          } md:translate-x-0`}
          style={{ minHeight: "100vh" }}
        >
          <Sidebar />
        </div>

        {showSidebar && (
          <div
            className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <div className="flex-1 flex flex-col items-center justify-start px-4 py-6">
          <div className="md:hidden w-full flex justify-between items-center bg-white p-4 shadow mb-4 rounded-md">
            <h1 className="text-xl font-bold">Staff Register</h1>
            <button
              className="p-2 rounded bg-gray-200"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-center mb-6">Staff Register</h1>

            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                nic: '',
                mobileNo: '',
                address: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="space-y-4" encType="multipart/form-data">
                  {["name", "email", "password", "nic", "mobileNo", "address"].map(field => (
                    <div key={field}>
                      <label htmlFor={`${field}_field`} className="block text-gray-700 capitalize">
                        {field === "mobileNo" ? "Mobile No" : field}
                      </label>
                      <Field
                        type={field === "password" ? "password" : "text"}
                        id={`${field}_field`}
                        name={field}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
                      />
                      <ErrorMessage name={field} component="div" className="text-red-500 text-sm" />
                    </div>
                  ))}

                  <div>
                    <label htmlFor="avatar_upload" className="block text-gray-700">Avatar</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16">
                        <img src={avatarPreview} alt="avatar" className="w-full h-full rounded-full object-cover" />
                      </div>
                      <input
                        type="file"
                        name="avatar"
                        onChange={handleAvatarChange}
                        className="border px-3 py-2 w-full rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed text-gray-700"
                        : "bg-[#20a39e] hover:bg-[#43c2be] text-white"
                    }`}
                  >
                    {loading ? "Sending Email..." : "Continue to OTP Verification"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DeliveryStaff;


// import  { Fragment, useState } from 'react';
// import Metadata from '../layouts/Metadata';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { sendOtp } from '../../actions/usersActions';
// import { resetUpdate } from '../../slices/authSlice';
// import Sidebar from '../admin/Sidebar';
// import { Menu } from "lucide-react";
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// const DeliveryStaff = () => {
//   const [avatar, setAvatar] = useState('');
//   const [avatarPreview, setAvatarPreview] = useState('/images/user.png');
//   const [showSidebar, setShowSidebar] = useState(false);
//   const { loading } = useSelector(state => state.authState);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const validationSchema = Yup.object({
//     name: Yup.string().required('Name is required'),
//     email: Yup.string().email('Invalid email').required('Email is required'),
//     password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
//     nic: Yup.string().required('NIC is required'),
//     mobileNo: Yup.string()
//       .matches(/^\d{10}$/, 'Mobile number must be 10 digits')
//       .required('Mobile number is required'),
//     address: Yup.string().required('Address is required'),
//   });

//   const handleSubmit = async (values) => {
//     if (!navigator.onLine) {
//       return toast.error('No internet connection. Please check your network.');
//     }

//     try {
//       await dispatch(sendOtp(values.email));
//       toast.success(`Email sent successfully to ${values.email}`);
//       dispatch(resetUpdate());

//       navigate('/sendOtp', {
//         state: {
//           userData: values,
//           avatar,
//           userType: 'deliveryStaff'
//         }
//       });
//     } catch (error) {
//       let errorMessage = 'Failed to send OTP. Please try again.';
//       if (error.message.includes('Network Error')) {
//         errorMessage = 'Network error! Please check your internet connection.';
//       } else if (error.response && error.response.data.message) {
//         errorMessage = error.response.data.message;
//       }

//       toast.error(errorMessage);
//     }
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setAvatarPreview(reader.result);
//           setAvatar(file);
//         }
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <Fragment>
//       <Metadata title="Register Staff" />
//       <div className='flex flex-col md:flex-row min-h-screen bg-gray-100'>
//         <div
//           className={`z-40 md:relative w-64 transition-transform duration-300 ease-in-out bg-gray-800 text-white ${
//             showSidebar ? "absolute top-0 left-0 translate-x-0" : "absolute -translate-x-full"
//           } md:translate-x-0`}
//           style={{ minHeight: "100vh" }}
//         >
//           <Sidebar />
//         </div>

//         {showSidebar && (
//           <div
//             className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
//             onClick={() => setShowSidebar(false)}
//           />
//         )}

//         <div className="flex-1 flex flex-col items-center justify-start px-4 py-6">
//           <div className="md:hidden w-full flex justify-between items-center bg-white p-4 shadow mb-4 rounded-md">
//             <h1 className="text-xl font-bold">Staff Register</h1>
//             <button
//               className="p-2 rounded bg-gray-200"
//               onClick={() => setShowSidebar(!showSidebar)}
//             >
//               <Menu className="w-6 h-6" />
//             </button>
//           </div>

//           <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
//             <h1 className="text-2xl font-semibold text-center mb-6">Staff Register</h1>

//             <Formik
//               initialValues={{
//                 name: '',
//                 email: '',
//                 password: '',
//                 nic: '',
//                 mobileNo: '',
//                 address: ''
//               }}
//               validationSchema={validationSchema}
//               onSubmit={handleSubmit}
//             >
//               {() => (
//                 <Form className="space-y-4" encType="multipart/form-data">
//                   {["name", "email", "password", "nic", "mobileNo", "address"].map(field => (
//                     <div key={field}>
//                       <label htmlFor={`${field}_field`} className="block text-gray-700 capitalize">
//                         {field === "mobileNo" ? "Mobile No" : field}
//                       </label>
//                       <Field
//                         type={field === "password" ? "password" : "text"}
//                         id={`${field}_field`}
//                         name={field}
//                         className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
//                       />
//                       <ErrorMessage name={field} component="div" className="text-red-500 text-sm" />
//                     </div>
//                   ))}

//                   <div>
//                     <label htmlFor="avatar_upload" className="block text-gray-700">Avatar</label>
//                     <div className="flex items-center space-x-4">
//                       <div className="w-16 h-16">
//                         <img src={avatarPreview} alt="avatar" className="w-full h-full rounded-full object-cover" />
//                       </div>
//                       <input
//                         type="file"
//                         name="avatar"
//                         onChange={handleAvatarChange}
//                         className="border px-3 py-2 w-full rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
//                       />
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
//                       loading
//                         ? "bg-gray-400 cursor-not-allowed text-gray-700"
//                         : "bg-[#20a39e] hover:bg-[#43c2be] text-white"
//                     }`}
//                   >
//                     {loading ? "Sending Email..." : "Continue to OTP Verification"}
//                   </button>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default DeliveryStaff;


// import React, { Fragment, useState } from 'react';
// import Metadata from '../layouts/Metadata';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { sendOtp } from '../../actions/usersActions';
// import { resetUpdate } from '../../slices/authSlice';
// import Sidebar from '../admin/Sidebar';
// import { Menu } from "lucide-react";

// const DeliveryStaff = () => {
//   const [userData, setUserData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     nic:'',
//     address:'',
//     mobileNo:'',
//   });
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [avatar, setAvatar] = useState('');
//   const [avatarPreview, setAvatarPreview] = useState('/images/user.png');
//   const { loading } = useSelector(state => state.authState);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Handle Input Changes
//   const onChange = (e) => {
//     if (e.target.name === 'avatar') {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setAvatarPreview(reader.result);
//           setAvatar(e.target.files[0]);
//         }
//       };
//       reader.readAsDataURL(e.target.files[0]);
//     } else {
//       setUserData({ ...userData, [e.target.name]: e.target.value });
//     }
//   };

//   // Handle Form Submission
//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (!userData.name || !userData.email || !userData.password) {
//       return toast.error('All fields are required!');
//     }

//     // Check if the user is online before making the request
//     if (!navigator.onLine) {
//       return toast.error('No internet connection. Please check your network.', {
//         position: 'bottom-center',
//         theme: 'dark',
//         autoClose: 5000
//       });
//     }

//     console.log("Sending OTP to:", userData.email);

//     try {
//       // Dispatch sendOtp and wait for the response
//       await dispatch(sendOtp(userData.email));

//       toast.success(`Email sent successfully to ${userData.email}`, {
//         position: 'bottom-center',
//         theme: 'dark',
//         autoClose: 5000
//       });

//       dispatch(resetUpdate()); 
//       navigate('/sendOtp', { state: { userData, avatar, userType:'deliveryStaff' } });
//     } catch (error) {
//       console.error('Error sending OTP:', error);

//       let errorMessage = 'Failed to send OTP. Please try again.';
//       if (error.message.includes('Network Error')) {
//         errorMessage = 'Network error! Please check your internet connection.';
//       } else if (error.response && error.response.data.message) {
//         errorMessage = error.response.data.message;
//       }

//       toast.error(errorMessage, {
//         position: "bottom-center",
//         autoClose: 5000,
//         theme: "dark",
//       });
//     }
//   };

//   return (
//     <Fragment>
//       <Metadata title="Register Staff" />
//       <div className='flex flex-col md:flex-row min-h-screen  bg-gray-100'>

//          <div
//         className={`z-40 md:relative w-64 transition-transform duration-300 ease-in-out bg-gray-800 text-white ${
//           showSidebar
//             ? "absolute top-0 left-0 translate-x-0"
//             : "absolute -translate-x-full"
//         } md:translate-x-0`}
//         style={{ minHeight: "100vh" }}
//       >
//         <Sidebar />
//       </div>

//       {showSidebar && (
//         <div
//           className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}
//         <div className="flex-1 flex flex-col items-center justify-start px-4 py-6">
//           <div className="md:hidden w-full flex justify-between items-center bg-white p-4 shadow mb-4 rounded-md">
//           <h1 className="text-xl font-bold">Staff Register</h1>
//           <button
//             className="p-2 rounded bg-gray-200"
//             onClick={() => setShowSidebar(!showSidebar)}
//           >
//             <Menu className="w-6 h-6" />
//           </button>
//         </div>
        
//           <div className="w-full max-w-md  bg-white shadow-lg rounded-lg p-6">
//           <h1 className="text-2xl font-semibold text-center mb-6">Staff Register</h1>
//           <form onSubmit={submitHandler} className="space-y-4" encType="multipart/form-data">
//             <div>
//               <label htmlFor="name_field" className="block text-gray-700">Name</label>
//               <input
//                 type="text"
//                 id="name_field"
//                 name="name"
//                 onChange={onChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
//               />
//             </div>
//             <div>
//               <label htmlFor="email_field" className="block text-gray-700">Email</label>
//               <input
//                 type="email"
//                 id="email_field"
//                 name="email"
//                 onChange={onChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
//               />
//             </div>
//             <div>
//               <label htmlFor="password_field" className="block text-gray-700">Password</label>
//               <input
//                 type="password"
//                 id="password_field"
//                 name="password"
//                 onChange={onChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
//               />
//             </div>
//             <div>
//               <label htmlFor="password_field" className="block text-gray-700">NIC</label>
//               <input
//                 type="text"
//                 id="nic_field"
//                 name="nic"
//                 onChange={onChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
//               />
//             </div>
//             <div>
//               <label htmlFor="password_field" className="block text-gray-700">Mobile No</label>
//               <input
//                 type="text"
//                 id="mobile_field"
//                 name="mobileNo"
//                 onChange={onChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
//               />
//             </div>
//             <div>
//               <label htmlFor="password_field" className="block text-gray-700">Address</label>
//               <input
//                 type="text"
//                 id="address_field"
//                 name="address"
//                 onChange={onChange}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
//               />
//             </div>
            
//             <div>
//               <label htmlFor="avatar_upload" className="block text-gray-700">Avatar</label>
//               <div className="flex items-center space-x-4">
//                 <div className="w-16 h-16">
//                   <img src={avatarPreview} className="w-full h-50% rounded-full object-cover" alt="avatar" />
//                 </div>
//                 <input
//                   type="file"
//                   name="avatar"
//                   onChange={onChange}
//                   id="customFile"
//                   className="border px-3 py-2 w-full rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
//                 />
//               </div>
//             </div>
//             <button
//               id="register_button"
//               type="submit"
//               className={`w-full py-3 rounded-lg font-medium transition duration-200
//                 ${loading ? "bg-gray-400 cursor-not-allowed text-gray-700" : "bg-[#20a39e] hover:bg-[#43c2be] text-white"}`}
//             >
//               {loading ? "Sending Email..." : "Continue to OTP Verification"} 
//             </button>
//           </form>
//         </div>
        
//       </div>
//       </div>
//     </Fragment>
//   );
// };

// export default DeliveryStaff;

