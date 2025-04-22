import axios from "axios";
import { productFail, productRequest, productSuccess, createReviewRequest, 
    createReviewSuccess, 
    createReviewFail , clearReviewSubmitted } from "../slices/productSlice";


export const getProduct = id => async (dispatch) => {
    try {
        dispatch(productRequest());
        
        const { data } = await axios.get(`http://localhost:8000/mfd/products/${id}`, {
            withCredentials: true, // Ensures cookies are sent for authentication
        });

        dispatch(productSuccess(data));
    } catch (error) {
        dispatch(productFail(error.response?.data?.message || "Something went wrong"));
    }
};

export const createReview = reviewData => async (dispatch) =>{
    try {
        
         dispatch(createReviewRequest());
         const config = {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true, 
          };

          const { data } = await axios.put('http://localhost:8000/mfd/review',reviewData,config);
          dispatch(createReviewSuccess());
    } catch (error) {
          dispatch(createReviewFail(error.response.data.message));
    }
}
