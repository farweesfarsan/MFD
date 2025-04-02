import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword,resetUpdateState } from '../../actions/usersActions';
import { clearErrors } from '../../slices/authSlice';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const { loading,error,user,message } = useSelector(state => state.authState);

    const submitHandler = (e) =>{
       e.preventDefault();
       const formData = new FormData();
       formData.append('email',email)
       dispatch(forgotPassword(formData));
    }

    useEffect(() => {
        if (message) {
            toast.success(message, { position: "bottom-center", theme: "dark", autoClose: 5000 });
            setEmail("");
            // dispatch(clearErrors());  
             dispatch(resetUpdateState());
        }
    
        if (error) {
            toast.error(error,
                 { position: "bottom-center",
                     autoClose: 5000,
                      theme: "dark" 
                    });
            dispatch(clearErrors());  
        }
    }, [message, error, dispatch]);
    

    return (
        <div className="flex justify-center items-center py-12 px-4 w-full max-w-full">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <form onSubmit={submitHandler} className="space-y-6">
                    <h1 className="text-2xl font-semibold text-center">Forgot Password</h1>

                    <div>
                        <label htmlFor="email_field" className="block text-sm font-medium text-gray-700">Enter Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#43c2be]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        id="forgot_password_button"
                        type="submit"
                        className={`w-full py-3 rounded-md font-semibold transition duration-300 
                            ${loading ? "bg-gray-400 cursor-not-allowed text-gray-700" : "bg-[#20a39e] hover:bg-[#43c2be] text-white"}`}       
                    >
                       {loading ? "Sending..." : "Send Email"} 
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
