import React from "react";
import { Triangle } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-gradient-to-b from-[#0e2438] to-[#020409] relative">
      {/* Glassmorphism Effect */}
      <div className="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-md"></div>

      {/* Neon Glowing Triangle */}
      <div className="relative z-10 flex flex-col items-center">
        <Triangle
          visible={true}
          height="150"
          width="150"
          color="#00ffcc" // Neon Cyan
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass="animate-neon-glow"
        />
      </div>
    </div>
  );
};

export default Loader;
