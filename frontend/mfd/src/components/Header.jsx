import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { FiMenu, FiX } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import Mfd_logo from '../assets/MLF_SMALL_LOGO.webp';
import Search from './layouts/Search';
import { logoutUser } from '../actions/usersActions';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { authenticatedUser, user, userLogged } = useSelector(state => state.authState);
  const { items } = useSelector(state => state.cartState); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutUser);
    navigate('/login');
  };

  const menuRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopoverOpen(false);
      }
    };
    if (popoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverOpen]);

  return (
    <header className="bg-gradient-to-r from-[#0e2438] to-[#93c7f8] text-white p-4 flex items-center justify-between relative">
      <div className="flex items-center space-x-6 md:space-x-4 lg:space-x-8">
        <Link to='/'>
          <img src={Mfd_logo} alt="Logo" className="w-16 md:w-20" />
        </Link>
        <nav className="hidden md:flex space-x-3 lg:space-x-6 flex-wrap">
          <Link to="/" className="hover:text-[#60f6fc]">Home</Link>
          <Link to="/products" className="hover:text-[#60f6fc]">Products</Link>
          <Link to="/contact" className="hover:text-[#60f6fc]">Contact</Link>
        </nav>
      </div>

      <Search />

      <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
        {authenticatedUser ? (
          <div className="relative" ref={popoverRef}>
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => setPopoverOpen(!popoverOpen)}
            >
              <Avatar 
                src={user?.avatar ?? './images/user/user.png'} 
                sx={{ width: 48, height: 48, border: '2px solid #ffffff' }} 
              />
              <span className="text-white font-bold text-lg">{user?.name}</span>
            </div>
            {popoverOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-900 rounded-lg shadow-lg py-2 z-50">
                
                <button 
                onClick={() => {
                  setPopoverOpen(false);
                  navigate('/admin/dashboard')
                }} 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Dashboard
              </button> 
               
                
                
                
                <button 
                  onClick={() => {
                    setPopoverOpen(false);
                    navigate('/myProfile');
                  }} 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </button>
                <button 
                  onClick={logoutHandler} 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to='/login' 
            className="rounded-2xl bg-[#e99820fa] px-4 md:px-6 py-2 md:py-3 text-white font-semibold shadow-lg hover:scale-110 hover:shadow-xl"
          >
            Login
          </Link>
        )}

        {/* Cart with Notification Badge */}
        <div className="relative bg-[#e99820fa] rounded-md p-3 hover:scale-110 hover:shadow-xl">
          <Link to='/cart'>
            <FaShoppingCart className='text-2xl cursor-pointer' />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden z-50">
        {menuOpen ? (
          <FiX className="text-3xl cursor-pointer" onClick={() => setMenuOpen(false)} />
        ) : (
          <FiMenu className="text-3xl cursor-pointer" onClick={() => setMenuOpen(true)} />
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div 
          ref={menuRef} 
          className="fixed top-0 left-0 h-full w-3/4 bg-[#0e2438] text-white p-6 flex flex-col space-y-6 shadow-lg transition-transform duration-300 z-50"
        >
          {/* Mobile Cart with Badge */}
          <div className="relative bg-[#e99820fa] w-12 h-12 flex items-center justify-center rounded-md hover:scale-110 hover:shadow-xl">
            <Link to="/cart">
              <FaShoppingCart className="text-2xl cursor-pointer" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          </div>

          {authenticatedUser && (
            <div className="flex flex-col items-center space-y-3 mt-4">
              <Avatar 
                src={user?.avatar ?? './images/user/user.png'} 
                sx={{ width: 60, height: 60, border: '2px solid #ffffff' }} 
              />
              <span className="text-white font-bold text-lg">{user?.name}</span>
              <div className="flex flex-col items-center w-full space-y-2 mt-3">
              <button onClick={() => {
                  setMenuOpen(false); 
                  navigate('/myProfile');
                }} className="w-full text-center text-white font-medium bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer">
                  Dashboard
                </button>
                <button onClick={() => {
                  setMenuOpen(false); 
                  navigate('/myProfile');
                }} className="w-full text-center text-white font-medium bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer">
                  Profile
                </button>
                <button onClick={() => {
                  setMenuOpen(false);
                  logoutHandler();
                }} className="w-full text-center text-red-500 font-medium bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer">
                  Logout
                </button>
              </div>
            </div>
          )}

          {!authenticatedUser && (
            <Link 
              onClick={() => setMenuOpen(false)} 
              to='/login' 
              className="rounded-2xl bg-[#e99820fa] px-6 py-3 text-white font-semibold shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
