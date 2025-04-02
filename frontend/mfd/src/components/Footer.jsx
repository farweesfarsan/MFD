
import React from 'react'
import { FaFacebookF, FaWhatsapp, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
          <footer className="bg-gradient-to-r from-[#0e2438] to-[#93c7f8] text-white p-6 mt-10">
          <div className="flex justify-center space-x-4">
              <FaFacebookF className="text-2xl cursor-pointer hover:opacity-80" />
              <FaWhatsapp className="text-2xl cursor-pointer hover:opacity-80" />
              <FaInstagram className="text-2xl cursor-pointer hover:opacity-80" />
          </div>
      </footer>
  );
}

export default Footer