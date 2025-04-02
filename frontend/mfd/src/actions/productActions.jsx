import axios from "axios";
import { productFail, productRequest, productSuccess } from "../slices/productSlice";

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
