import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/Header";
import Home from "./components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import ProductDetails from "./components/products/productDetails";
import ProductSearch from "./components/layouts/ProductSearch";
import Profile from "./components/user/Profile";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import UpdateProfile from "./components/user/updateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";
import store from './store'
import { loadUser } from "./actions/usersActions";
import ProtectedRoute from "./components/route/ProtectedRoute";
import OTPStepper from "./components/user/OTPStepper";



const App = () => {
    useEffect(() => {
        store.dispatch(loadUser)
    }, []);
    return (
        <HelmetProvider>
            <Router>
                <div className="font-sans">
                    <Header />
                    
                    <ToastContainer position="bottom-center" autoClose={5000} />
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/products/:id" element={<ProductDetails/>}/>
                        <Route path="/search/:keyword" element={<ProductSearch/>}/>  
                        <Route path="/login" element={<Login/>}/> 
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/sendOtp" element={<OTPStepper/>}/> 
                        {/* <Route path="/verify-email?token=:token" element={<VerifyEmail />}/> */}
                        <Route path="/myProfile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                        <Route path="/update" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}/>
                        <Route path="/myProfile/update/updatePassword" element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>}/>
                        <Route path="/password/forgot" element={<ForgotPassword/>}/>
                        <Route path="/password/reset/:token" element={<ResetPassword/>}/>

                    </Routes>
                  
                </div>
            </Router>
        </HelmetProvider>
    );
};

export default App;
