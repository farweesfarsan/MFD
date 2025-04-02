import React from 'react'
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Products = ({product}) => {

    const Rating = ({ rating }) => {
        const getColor = (rating) => {
            if (rating >= 4.5) return "text-yellow-500"; // Excellent
            if (rating >= 3.5) return "text-yellow-400"; // Good
            if (rating >= 2.5) return "text-yellow-300"; // Average
            return "text-gray-300"; // No rating
        };

        return (
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;
                    return rating >= starValue ? (
                        <FaStar key={index} className={`text-lg ${getColor(rating)}`} />
                    ) : rating >= starValue - 0.5 ? (
                        <FaStarHalfAlt key={index} className={`text-lg ${getColor(rating)}`} />
                    ) : (
                        <FaRegStar key={index} className="text-lg text-gray-300" />
                    );
                })}
            </div>
        );
    };
  return (
    <div  className="bg-white p-5 rounded-lg shadow-md">
    <img
        className="w-full h-50 object-cover rounded-md"
        src={product.images[0].image}
        alt={product.name}
    />
    <div className="mt-4 flex flex-col">
        <h5 className="text-lg font-semibold text-gray-800">
            {product.name}
        </h5>
        <div className="flex items-center mt-2">
            <Rating rating={parseFloat(product.ratings)} />
            <span className="ml-2 text-gray-500 text-sm">({product.numOfReviews} Reviews)</span>
        </div>
        <p className="mt-2 text-lg font-bold text-gray-700">Rs.{product.price}</p>

        <Link to={`/products/${product._id}`} className='mt-3 bg-[#20a39e] hover:bg-[#43c2be] text-white py-2 px-4 rounded-lg text-center'>View Details</Link>
    </div>
</div>
  )
}

export default Products