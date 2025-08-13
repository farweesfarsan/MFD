import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import profile from '../../assets/user.png'

const Profile = () => {
  const { user } = useSelector(state => state.authState);

  return (
    <div className="flex flex-col md:flex-row items-start justify-center mt-10 px-6 gap-10">
      {/* Profile Card */}
      <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center md:w-1/3">
        <figure className="w-40 h-40 overflow-hidden rounded-full border-4 border-blue-500 shadow-md">
         <img
          className="w-full h-full object-cover"
          src={user.avatar ? user.avatar : profile}
          alt="Profile"
        />
        </figure>

        <h2 className="text-2xl font-bold mt-4 text-gray-800">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>

        <Link
          to="/update"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md w-full text-center transition duration-300"
        >
          Edit Profile
        </Link>
      </div>

      {/* Info & Actions */}
      <div className="flex-1 bg-white shadow-xl rounded-2xl p-6 w-full">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700">Full Name</h4>
          <p className="text-gray-600">{user.name}</p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700">Email Address</h4>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700">Joined In</h4>
          <p className="text-gray-600">{String(user.createdAt).substring(0, 10)}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/profile/myOrders"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md text-center w-full sm:w-auto transition duration-300"
          >
            My Orders
          </Link>
          <Link
            to="/myProfile/update/updatePassword"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md text-center w-full sm:w-auto transition duration-300"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
