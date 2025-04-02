import React, { useEffect } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../actions/productActions";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import Loader from "../layouts/Loader";
import Metadata from "../layouts/Metadata";


const ProductDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const { product, loading } = useSelector((state) => state.productState);
    
    useEffect(() => {
        dispatch(getProduct(id));
    }, [dispatch, id]);

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
        <Fragment>
            {loading ? <Loader/> : 
             <Fragment>
                <Metadata title={product?.name}/>
             <div className="container mx-auto my-10 px-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="flex justify-center mt-6">
             <div className="border-4 border-[#17415e] rounded-lg p-2 shadow-lg w-72 md:w-80 lg:w-96">
              <img
              id="product_image"
              src={product?.images[0]?.image}
              alt={product?.name}
              className="w-full h-auto object-contain rounded-md"
             />
            </div>
           </div>
 
                     
                     <div>
                         <h2 className="text-3xl font-semibold text-gray-900">{product?.name}</h2>
                         <p id="product_id" className="text-sm text-gray-500">Product ID: #{product?._id}</p>
                         <hr />
                         
                         <div className="flex items-center my-2">
                         <Rating rating ={parseFloat(product?.ratings)} />
                             <span id="no_of_reviews" className="ml-2 text-sm text-gray-500">
                                 ({product?.numOfReviews} Reviews)
                             </span>
                         </div>
                        
                         <hr />
                         
                         <p id="product_price" className="text-3xl font-bold text-gray-800">Rs. {product?.price}</p>
                         
                         <div className="flex items-center gap-4 mt-4">
                             <button className="minus bg-gray-300 px-3 py-2 rounded-md">-</button>
                             <input type="number" className="stockCounter border w-14 text-center py-1 rounded-md" defaultValue="1" />
                             <button className="plus bg-gray-300 px-3 py-2 rounded-md">+</button>
                             <button id="cart_btn" className="bg-yellow-500 text-white py-2 px-6 rounded-full text-lg font-semibold">
                                 Add to Cart
                             </button>
                         </div>
                         <hr className="mt-4" />
                         
                         <p className="text-lg font-semibold flex items-center mt-2">
                             Status:
                             <span id="stock_status" className={`ml-2 font-bold ${product?.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                 {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
                             </span>
                         </p>
                         <hr />
                         
                         <div>
                             <p className="text-lg font-semibold mt-2">Description</p>
                             <p>{product?.description}</p>
                         </div>
                         <hr />
                         
                         <div className="mt-12">
                             <button id="review_btn" className="mt-4 bg-yellow-500 text-white py-2 px-8 rounded-full text-lg font-semibold">
                                 Write a Review
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
             </Fragment>
            }
           
        </Fragment>
        
    );
};

export default ProductDetails;

