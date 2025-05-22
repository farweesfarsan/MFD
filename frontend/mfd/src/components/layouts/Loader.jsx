import React from "react";
import { Triangle } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-gradient-to-b from-[#0e2438] to-[#020409] relative">
      <div className="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-md"></div>

      <div className="relative z-10 flex flex-col items-center">
        <Triangle
          visible={true}
          height="200"
          width="200"
          color="#00ffcc" 
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass="animate-neon-glow"
        />
      </div>
    </div>
  );
};

export default Loader;
