import axios from "axios";
import { adminProductFail, adminProductRequest, adminProductSuccess, productsFail, productsRequest, productsSuccess } from "../slices/productsSlice";

export const getProducts = (keyword = "", page = 1, category = "") => async (dispatch) => {
  try {
    dispatch(productsRequest());

    let link = `http://localhost:8000/mfd/products?page=${page}`;
    if (keyword) link += `&keyword=${keyword}`;
    if (category) link += `&category=${category}`; 

    const { data } = await axios.get(link, { withCredentials: true }); 
    dispatch(productsSuccess(data));
  } catch (error) {
    dispatch(productsFail(error.response?.data?.message || "Something went wrong"));
  }
};


export const getAdminProducts = (page = 1, limit = 6) => async (dispatch) => {
  try {
    dispatch(adminProductRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `http://localhost:8000/mfd/admin/getAllProducts?page=${page}&limit=${limit}`,
      config
    );

    dispatch(adminProductSuccess(data)); // Assuming data includes products, totalCount, etc.

  } catch (error) {
    dispatch(adminProductFail(error.response?.data?.message || "Something went wrong"));
  }
};



