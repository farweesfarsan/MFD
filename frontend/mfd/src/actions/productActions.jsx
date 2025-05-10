import axios from "axios";
import { productFail, productRequest, productSuccess, createReviewRequest, 
    createReviewSuccess, 
    createReviewFail , clearReviewSubmitted, newProductRequest, newProductSuccess, newProductFail, clearProductCreater,deleteProductRequest,
    deleteProductSuccess,deleteProductFail,clearProductDelete 
    } from "../slices/productSlice";


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

export const createNewProduct = (formData) => async (dispatch) => {
  try {
    dispatch(newProductRequest());
    const { data } = await axios.post(
    `http://localhost:8000/mfd/admin/products/new`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
        withCredentials: true, 
      }
    );
    dispatch(newProductSuccess(data)); 

    // handle success
    console.log(data.product);
  } catch (error) {
    dispatch(newProductFail(error.response?.data?.message || "Something went wrong"));
  }
};

export const deleteProduct = id => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());
    const config = {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
      withCredentials: true, 
    }

    await axios.delete(
    `http://localhost:8000/mfd/admin/products/${id}`,
      config
    );
    dispatch(deleteProductSuccess()); 

  } catch (error) {
    dispatch(deleteProductFail(error.response?.data?.message || "Something went wrong"));
  }
};
