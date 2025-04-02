import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch
import { resetPassword } from '../../actions/usersActions';
import { clearErrors,resetUpdate } from '../../slices/authSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");

    const dispatch = useDispatch(); // Corrected: Get dispatch function
    const { authenticatedUser, error, loading, isUpdated } = useSelector(state => state.authState);
    const navigate = useNavigate();
    const { token } = useParams();

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('password', password);
        formData.append('confirmedPassword', confirmedPassword);
        dispatch(resetPassword(formData, token));
    };

    // useEffect(() => {
    //     if (authenticatedUser) {
    //         toast.success("Password Reset Successfully!", {
    //             position: "bottom-center",
    //             theme: "dark",
    //             autoClose: 5000
    //         });

    //         navigate('/');
    //     }

    //     if (error) {
    //         toast.error(error, {
    //             position: "bottom-center",
    //             autoClose: 5000,
    //             theme: "dark"
    //         });
    //         dispatch(clearErrors());
    //     }

    // }, [authenticatedUser, error, dispatch, navigate]);

    useEffect(() => {
      if (isUpdated) {
          toast.success("Password Reset Successfully!", {
              position: "bottom-center",
              theme: "dark",
              autoClose: 5000
          });
  
          navigate('/');
          window.location.reload();
          dispatch(resetUpdate()); // Reset update state to prevent unwanted redirects
      }
  
      if (error) {
          toast.error(error, {
              position: "bottom-center",
              autoClose: 5000,
              theme: "dark"
          });
          dispatch(clearErrors());
      }
  
  }, [isUpdated, error, dispatch, navigate]);
  
    return (
        <div className="flex justify-center items-center py-14 px-4 w-full max-w-full">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <form onSubmit={submitHandler} className="space-y-4">
                    <h1 className="text-2xl font-semibold text-center">New Password</h1>

                    <div>
                        <label htmlFor="password_field" className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm_password_field" className="block text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={confirmedPassword}
                            onChange={e => setConfirmedPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg transition duration-300  
                        ${loading ? "bg-gray-400 cursor-not-allowed text-gray-700" : "bg-[#20a39e] hover:bg-[#43c2be] text-white"}
                        `}>
                       {loading ? "Pending..." : "Set Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
