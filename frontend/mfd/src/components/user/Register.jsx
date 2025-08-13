import React, { Fragment, useState } from 'react';
import Metadata from '../layouts/Metadata';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../../actions/usersActions';
import { resetUpdate } from '../../slices/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const [avatarPreview, setAvatarPreview] = useState('/images/user.png');
  const { loading } = useSelector(state => state.authState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Minimum 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
        'Password must include at least 1 uppercase letter, 1 lowercase letter, and 1 special character'
      )
      .required('Password is required'),
  
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(sendOtp(values.email));
      toast.success(`Email sent successfully to ${values.email}`, {
        position: 'bottom-center',
        theme: 'dark',
        autoClose: 5000,
      });
      dispatch(resetUpdate());
      navigate('/sendOtp', { state: { userData: values, avatar: values.avatar, userType: 'user' } });
    } catch (error) {
      const errorMessage = error.message || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage, {
        position: 'bottom-center',
        autoClose: 5000,
        theme: 'dark',
      });
    }
    setSubmitting(false);
  };

  const handleAvatarChange = (e, setFieldValue) => {
    const file = e.currentTarget.files[0];
    if (file) {
      setFieldValue('avatar', file);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Fragment>
      <Metadata title="Register" />
      <div className="flex justify-center items-center py-10 px-4">
        <div className="w-full max-w-md lg:w-1/3 bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-center mb-4">Register</h1>

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              avatar: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-4" encType="multipart/form-data">
                <div>
                  <label htmlFor="name_field" className="block text-gray-700">
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name_field"
                    name="name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label htmlFor="email_field" className="block text-gray-700">
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email_field"
                    name="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label htmlFor="password_field" className="block text-gray-700">
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password_field"
                    name="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>

                <div>
                  <label htmlFor="avatar_upload" className="block text-gray-700">
                    Avatar
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16">
                      <img
                        src={avatarPreview}
                        alt="avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <input
                      id="avatar_upload"
                      name="avatar"
                      type="file"
                      onChange={(e) => handleAvatarChange(e, setFieldValue)}
                      className="border px-3 py-2 w-full rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
                    />
                  </div>
                  <ErrorMessage name="avatar" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                    isSubmitting || loading
                      ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                      : 'bg-[#20a39e] hover:bg-[#43c2be] text-white'
                  }`}
                >
                  {loading || isSubmitting ? 'Sending Email...' : 'Continue to OTP Verification'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
