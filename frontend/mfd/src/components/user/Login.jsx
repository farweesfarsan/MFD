import React, { Fragment, useEffect, useState } from "react";
import Metadata from "../layouts/Metadata";
import { login } from "../../actions/usersActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { resetUpdate } from "../../slices/authSlice";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, authenticatedUser } = useSelector(state => state.authState);

    const redirect = location.search?'/'+location.search.split('=')[1]:'/';

    useEffect(() => {
        if (authenticatedUser) {
            navigate(redirect);
        }
        if (error) {
            toast.error(error, {
                position: "bottom-center",
                autoClose: 5000,
                theme: "dark",
            });
           dispatch(resetUpdate());
        }
    }, [error, loading, authenticatedUser]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    };

    return (
        <Fragment>
            <Metadata title="Login" />
            <div className="flex justify-center items-center py-10  px-4">
                <div className="w-full max-w-md lg:w-1/3 bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

                    <form className="space-y-4" onSubmit={submitHandler}>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email_field" className="block text-gray-700 font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email_field"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43c2be] outline-none"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <label htmlFor="password_field" className="block text-gray-700 font-medium mb-1">
                                Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password_field"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43c2be] outline-none"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />

                            {/* Visibility Toggle Icon */}
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[70%] transform -translate-y-1/2 cursor-pointer text-gray-500"
                            >
                                {showPassword ? (
                                    <VisibilityIcon className="text-[25px] text-[#4cbfe2]" />
                                ) : (
                                    <VisibilityOffIcon className="text-[25px] text-[#4cbfe2]" />
                                )}
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <Link to='/password/forgot' className="text-blue-600 hover:underline text-sm">Forgot Password?</Link>
                        </div>

                        {/* Login Button */}
                        <button
                            id="login_button"
                            type="submit"
                            className={`w-full py-3 rounded-lg font-medium transition duration-200 
                            ${loading ? "bg-gray-400 cursor-not-allowed text-gray-700" : "bg-[#20a39e] hover:bg-[#43c2be] text-white"}`}
                        >
                            {loading ? "Logging in..." : "LOGIN"}  
                        </button>

                        {/* New User Link */}
                        <div className="text-center mt-3">
                            <Link to='/register'  className="text-blue-600 hover:underline text-sm">New User?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default Login;
