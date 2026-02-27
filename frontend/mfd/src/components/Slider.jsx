/*import React, { useState, useEffect } from "react";
import imageSlide from "../../src/data";

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageSlide.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imageSlide.length) % imageSlide.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageSlide.length);
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[700px] md:h-[700px] lg:h-[450px] overflow-hidden z-0">
      {imageSlide.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            currentIndex === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundColor: slide.bgColor }}
        >
          <div
  key={index}
  className={`absolute inset-0 transition-opacity duration-1000 ${
    currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
  } ${slide.gradient} flex justify-center items-center`}
>
  <div className="flex flex-col sm:flex-row justify-center items-center h-full px-4 sm:px-10 space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-down">
    <div className="text-center sm:text-left text-white max-w-xs sm:max-w-sm md:max-w-md">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 animate-slide-in-left">
        {slide.title}
      </h2>
      <p className="text-sm sm:text-base md:text-lg mb-2 sm:mb-4 animate-slide-in-left delay-100">
        {slide.description}
      </p>
    </div>
    <img
      src={slide.url}
      className="h-[200px] sm:h-[250px] md:h-[300px] w-auto rounded-lg animate-zoom-in"
      alt={slide.title}
    />
  </div>
</div>

        </div>
      ))}
      
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 sm:p-3"
      >
        &#10094;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 sm:p-3"
      >
        &#10095;
      </button>
     
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {imageSlide.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;*/

import React from "react";
import heroImg from "../assets/milk.jpg"; // add your banner image

const Slider = () => {
  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="relative rounded-3xl overflow-hidden">
          
          {/* Background Image */}
          <img
            src={heroImg}
            alt="Kitchen Towels"
            className="w-full h-[500px] object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center">
            <div className="ml-16 max-w-lg text-white">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Kitchen Towels That Stay Soft After 90°C Washes
              </h1>

              <p className="mt-4 text-lg">
                Crafted for chefs, loved by home cooks. Discover the softness,
                strength, and style.
              </p>

              <button className="mt-6 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-black hover:text-white transition">
                Shop Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Slider;

