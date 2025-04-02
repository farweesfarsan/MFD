
import React, { Fragment, useState } from 'react';
import Metadata from '../layouts/Metadata';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../../actions/usersActions';
import { resetUpdate } from '../../slices/authSlice';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('/images/user.png');
  const { loading } = useSelector(state => state.authState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle Input Changes
  const onChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(e.target.files[0]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };

  // Handle Form Submission
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userData.name || !userData.email || !userData.password) {
      return toast.error('All fields are required!');
    }

    // Check if the user is online before making the request
    if (!navigator.onLine) {
      return toast.error('No internet connection. Please check your network.', {
        position: 'bottom-center',
        theme: 'dark',
        autoClose: 5000
      });
    }

    console.log("Sending OTP to:", userData.email);

    try {
      // Dispatch sendOtp and wait for the response
      await dispatch(sendOtp(userData.email));

      toast.success(`Email sent successfully to ${userData.email}`, {
        position: 'bottom-center',
        theme: 'dark',
        autoClose: 5000
      });

      dispatch(resetUpdate()); 
      navigate('/sendOtp', { state: { userData, avatar } });
    } catch (error) {
      console.error('Error sending OTP:', error);

      let errorMessage = 'Failed to send OTP. Please try again.';
      if (error.message.includes('Network Error')) {
        errorMessage = 'Network error! Please check your internet connection.';
      } else if (error.response && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage, {
        position: "bottom-center",
        autoClose: 5000,
        theme: "dark",
      });
    }
  };

  return (
    <Fragment>
      <Metadata title="Register" />
      <div className="flex justify-center items-center py-10 px-4">
        <div className="w-full max-w-md lg:w-1/3 bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-center mb-4">Register</h1>
          <form onSubmit={submitHandler} className="space-y-4" encType="multipart/form-data">
            <div>
              <label htmlFor="name_field" className="block text-gray-700">Name</label>
              <input
                type="text"
                id="name_field"
                name="name"
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
              />
            </div>
            <div>
              <label htmlFor="email_field" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email_field"
                name="email"
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
              />
            </div>
            <div>
              <label htmlFor="password_field" className="block text-gray-700">Password</label>
              <input
                type="password"
                id="password_field"
                name="password"
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
              />
            </div>
            <div>
              <label htmlFor="avatar_upload" className="block text-gray-700">Avatar</label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16">
                  <img src={avatarPreview} className="w-full h-50% rounded-full object-cover" alt="avatar" />
                </div>
                <input
                  type="file"
                  name="avatar"
                  onChange={onChange}
                  id="customFile"
                  className="border px-3 py-2 w-full rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
                />
              </div>
            </div>
            <button
              id="register_button"
              type="submit"
              className={`w-full py-3 rounded-lg font-medium transition duration-200
                ${loading ? "bg-gray-400 cursor-not-allowed text-gray-700" : "bg-[#20a39e] hover:bg-[#43c2be] text-white"}`}
            >
              {loading ? "Sending Email..." : "Continue to OTP Verification"} 
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
