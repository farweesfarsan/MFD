import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../Sidebar";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getUser,updateUser } from "../../../actions/usersActions";
import { clearError,clearUserUpdated } from "../../../slices/userSlice";

const UpdateUser = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNo,setMobileNo] = useState("");

  const userRole = [
    "Customer",
    "Admin",
  ];
  const { loading, isUserUpdated, error, user } = useSelector((state) => state.userState);
  const { user:authUser } = useSelector(state => state.authState);
   
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();


  // Submit the form data
  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);

    if (role === "DeliveryStaff") {
    formData.append("nic", nic);
    formData.append("mobileNo", mobileNo);
    formData.append("address", address);
  }
   
    dispatch(updateUser(userId, formData));
  };

  // Fetch product details when component loads
  useEffect(() => {
    dispatch(getUser(userId));
  }, [dispatch, userId]);

  // Handle success and error messages
  useEffect(() => {
    if (isUserUpdated) {
      toast.success("User Updated Successfully!", {
        position: "bottom-center",
        theme: "dark",
        onOpen: () => dispatch(clearUserUpdated()),
      });
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        theme: "dark",
        onOpen: () => dispatch(clearError()),
      });
    }
  }, [isUserUpdated, error, dispatch, navigate]);

  useEffect(() => {
    if (user && user._id) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "");
    }

    if(user.role === 'DeliveryStaff'){
      setNic(user.nic || "");
      setMobileNo(user.mobileNo || "");
      setAddress(user.address || "");
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`z-40 md:relative w-64 transition-transform duration-300 ease-in-out bg-gray-800 text-white ${
          showSidebar
            ? "absolute top-0 left-0 translate-x-0"
            : "absolute -translate-x-full"
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

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden p-4 flex justify-between items-center bg-white shadow">
          <h1 className="text-xl font-bold">Update User</h1>
          <button
            className="p-2 rounded bg-gray-200"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 flex-grow flex justify-center">
          <form
            onSubmit={submitHandler}
            encType="multipart/form-data"
            className="bg-white w-full max-w-2xl p-6 md:p-8 rounded-xl shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Update User
            </h2>

            {/* Name Field */}
            <div className="mb-4">
              <label
                htmlFor="name_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name_field"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Price Field */}
            <div className="mb-4">
              <label
                htmlFor="price_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                id="price_field"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>


            {/* Role Field */}
            <div className="mb-4">
              <label
                htmlFor="category_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="category_field"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                value={role}
                disabled={user._id === authUser._id }
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select</option>
                {userRole.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {role === "DeliveryStaff" ? (
              <>
              <div className="mb-4">
              <label
                htmlFor="price_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                NIC
              </label>
              <input
                type="text"
                id="price_field"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                value={nic}
                onChange={(e) => setNic(e.target.value)}
              />
            </div>
            
             <div className="mb-4">
              <label
                htmlFor="price_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                MobileNo
              </label>
              <input
                type="text"
                id="price_field"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              />
            </div>
            
             <div className="mb-4">
              <label
                htmlFor="price_field"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="price_field"
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            </>
            ):null}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-gray-700"
                  : "bg-[#20a39e] hover:bg-[#43c2be] text-white"
              }`}
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
