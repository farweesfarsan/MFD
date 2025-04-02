import React, { useState, useEffect } from "react";
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
          <div className="flex flex-col sm:flex-row justify-center items-center h-full px-4 sm:px-10 space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="text-center sm:text-left text-white max-w-xs sm:max-w-sm md:max-w-md">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4">{slide.title}</h2>
              <p className="text-sm sm:text-base md:text-lg mb-2 sm:mb-4">{slide.description}</p>
              <button className="border border-gray-500 bg-[#224F34] mt-2 text-white rounded-md px-4 py-2 text-sm sm:text-base">
                Order Now
              </button>
            </div>
            <img
              src={slide.url}
              className="h-[200px] sm:h-[250px] md:h-[300px] w-auto rounded-lg"
              alt={slide.title}
            />
          </div>
        </div>
      ))}
      {/* Previous and Next Buttons */}
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
      {/* Dots Indicator */}
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

export default Slider;
