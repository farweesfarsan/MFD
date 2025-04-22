import React, { useState } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { format } from 'date-fns'; // Optional, if you want custom date formatting

// Render stars based on rating
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
  }

  while (stars.length < 5) {
    stars.push(<FaRegStar key={`empty-${stars.length}`} className="text-yellow-400" />);
  }

  return stars;
};

// Product Review component
const ProductReview = ({ reviews }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 4;

  const startIndex = currentPage * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const paginatedReviews = reviews.slice(startIndex, endIndex);

  const handleNext = () => {
    if (endIndex < reviews.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>

      {/* Review Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {paginatedReviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-semibold text-gray-800">{review.user.name}</div>
              <span className="text-sm text-gray-500">
                {/* Display formatted date */}
                {format(new Date(review.createdAt), 'MM/dd/yyyy')} {/* Optional custom format */}
              </span>
            </div>

            <div className="flex items-center mb-2">
              {renderStars(Number(review.rating))}
              <span className="ml-2 text-sm text-gray-600">({review.rating})</span>
            </div>

            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex flex-col lg:flex-row lg:justify-center lg:items-center gap-1">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded ${currentPage === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700'}`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={endIndex >= reviews.length}
          className={`px-4 py-2 rounded ${endIndex >= reviews.length ? 'bg-[#84abc7] text-gray-600 cursor-not-allowed' : 'bg-[#17415e] text-white'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductReview;
