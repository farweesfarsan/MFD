import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useSelector(state => state.authState);
  return (
    <div className="flex flex-col md:flex-row items-center justify-around mt-5">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center md:w-1/4">
        <figure className="w-40 h-40 overflow-hidden rounded-full border-4 border-gray-300">
          <img className="w-full h-full object-cover" src={user.avatar??'./images/user/user.png'} alt="Profile" />
        </figure>
        <Link to='/update' className="bg-blue-500 text-white px-6 py-2 rounded-md mt-5 w-full text-center">
          Edit Profile
        </Link>
      </div>
      
      {/* User Info Section */}
      <div className="md:w-2/4 text-center md:text-left mt-5 md:mt-0">
        <h4 className="text-lg font-semibold">Full Name</h4>
        <p className="text-gray-700">{user.name}</p>

        <h4 className="text-lg font-semibold mt-3">Email Address</h4>
        <p className="text-gray-700">{user.email}</p>

        <h4 className="text-lg font-semibold mt-6">Joined In</h4>
        <p className="text-gray-700">{String(user.createdAt).substring(0,10)}</p>

        <Link to="/myProfile/orders" className="bg-red-500 text-white px-6 py-2 rounded-md mt-5 block w-full md:w-auto text-center">
          My Orders
        </Link>

        <Link to='/myProfile/update/updatePassword' className="bg-blue-500 text-white px-6 py-2 rounded-md mt-3 block w-full md:w-auto text-center">
          Change Password
        </Link>
      </div>
    </div>
  );
};

export default Profile;
