import axios from "axios";
import { productFail, productRequest, productSuccess, createReviewRequest, 
    createReviewSuccess, 
    createReviewFail , clearReviewSubmitted, newProductRequest, newProductSuccess, newProductFail, clearProductCreater,deleteProductRequest,
    deleteProductSuccess,deleteProductFail,clearProductDelete, 
    updateProductRequest,
    updateProductSuccess,
    updateProductFail,
    reviewSuccess,
    reviewRequest,
    reviewFail,
    deleteReviewRequest,
    deleteReviewSuccess,
    deleteReviewFail
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
export const updateProduct = (id,productData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest());
    const { data } = await axios.put(
    `http://localhost:8000/mfd/admin/products/${id}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
        withCredentials: true, 
      }
    );
    dispatch(updateProductSuccess(data)); 

    // handle success
    console.log(data.product);
  } catch (error) {
    dispatch(updateProductFail(error.response?.data?.message || "Something went wrong"));
  }
};

export const getReviews = id => async (dispatch) => {
  try {
    dispatch(reviewRequest());

    const { data } = await axios.get(`http://localhost:8000/mfd/admin/review`, {
      params: { id },
      withCredentials: true, 
    });

    dispatch(reviewSuccess(data));
  } catch (error) {
    dispatch(reviewFail(error.response?.data?.message || "Something went wrong"));
  }
};


export const deleteReviews = (productId, id) => async (dispatch) => {
  try {
    dispatch(deleteReviewRequest());

    await axios.delete(
      `http://localhost:8000/mfd/admin/review`,
      {
        params: { productId, id },
        withCredentials: true, // ✅ must be inside config
      }
    );

    dispatch(deleteReviewSuccess());
  } catch (error) {
    dispatch(
      deleteReviewFail(error.response?.data?.message || "Something went wrong")
    );
  }
};

export const getAllReviews = () => async (dispatch) => {
  try {
    dispatch(reviewRequest());

    const { data } = await axios.get(`http://localhost:8000/mfd/admin/allReviews`, {
      withCredentials: true, 
    });

    dispatch(reviewSuccess(data));
  } catch (error) {
    dispatch(reviewFail(error.response?.data?.message || "Something went wrong"));
  }
};


