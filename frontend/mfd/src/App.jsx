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
import Cart from "./components/cart/cart";
import Delivery from "./components/cart/delivery";
import Payment from "./components/cart/Payment";
import ConfirmOrder from "./components/cart/confirmOrder";
import SuccessPayment from "./components/cart/paymentSuccess";
import OTPStepper from "./components/user/OTPStepper";
import  SubscriptionPlans  from "./components/subscription/SubscriptionPlans";
import { PaymentProvider } from "./context/paymentContext";
import SubscriptionSuccess from "./components/subscription/SubscriptionSuccess";
import SubscriptionCancel from "./components/subscription/subscriptionCancel";
import Dashboard from "./components/admin/dashboard/Dashboard";
import ProductList from "./components/admin/dashboard/ProductsList";
import Addnewproducts from "./components/admin/dashboard/Addnewproducts";
import AdminDashboard from "./components/admin/AdminDashboard";
import UpdateProducts from "./components/admin/dashboard/updateProducts";
import OrderList from "./components/admin/dashboard/OrderList";
import UpdateOrder from "./components/admin/dashboard/UpdateOrder";
import OrderCancel from "./components/cart/OrderCancel";
import UserList from "./components/admin/dashboard/UserList";
import UpdateUser from "./components/admin/dashboard/UpdateUser";
import DeliveryStaff from "./components/user/DeliveryStaff";
import DeliveryStaffPage from "./page/DeliverysStaffPage";
import ReviewList from "./components/admin/dashboard/ReviewList";

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser)
    }, []);
    return (
        <HelmetProvider>
            <PaymentProvider>
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
                        <Route path="/myProfile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
                        <Route path="/update" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}/>
                        <Route path="/myProfile/update/updatePassword" element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>}/>
                        <Route path="/password/forgot" element={<ForgotPassword/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/delivery" element={<ProtectedRoute><Delivery/></ProtectedRoute>}/>
                        <Route path="/password/reset/:token" element={<ResetPassword/>}/>
                        <Route path="/order/confirm" element={<ConfirmOrder/>}/>
                        <Route path="/payment" element={<Payment/>}/>
                        <Route path="/payment/success" element={<SuccessPayment/>}/>
                        <Route path="/subscription/success" element={<SubscriptionSuccess/>}/>
                        <Route path="/subscription" element={<SubscriptionPlans/>}/>
                        <Route path="/subscription-success" element={<SubscriptionSuccess/>}/>
                        <Route path="/subscription-cancel" element={<SubscriptionCancel/>}/>
                        <Route path="/order-cancel" element={<OrderCancel/>}/>

                    </Routes>
                  
                </div>
                <Routes>
                  {/* <Route path="/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard/></ProtectedRoute>}/> */}
                  <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList/></ProtectedRoute>}/>
                  <Route path="/admin/products/new" element={<ProtectedRoute isAdmin={true}><Addnewproducts/></ProtectedRoute>}/>
                  <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard/></ProtectedRoute>}/>
                  <Route path="/admin/products/:id" element={<ProtectedRoute isAdmin={true}><UpdateProducts/></ProtectedRoute>}/>
                  <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}><OrderList/></ProtectedRoute>}/>
                  <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><UpdateOrder/></ProtectedRoute>}/>
                  <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><UserList/></ProtectedRoute>}/>
                  <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}><ReviewList/></ProtectedRoute>}/>
                  <Route path="/admin/users/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser/></ProtectedRoute>}/>
                  <Route path="/admin/users/newDeliveryStaff" element={<ProtectedRoute isAdmin={true}><DeliveryStaff/></ProtectedRoute>}/>
                   
                  <Route path="/deliveryStaff/deliveryStaffPage" element={<ProtectedRoute isDeliveryStaff={true}><DeliveryStaffPage/></ProtectedRoute>}/>
                </Routes>
            </Router>
            </PaymentProvider>
        </HelmetProvider>
    );
};

export default App;
