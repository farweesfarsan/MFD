import axios from "axios";
import { productsFail, productsRequest, productsSuccess } from "../slices/productsSlice";

export const getProducts = (keyword = "", page = 1, category = "") => async (dispatch) => {
  try {
    dispatch(productsRequest());

    let link = `http://localhost:8000/mfd/products?page=${page}`;
    if (keyword) link += `&keyword=${keyword}`;
    if (category) link += `&category=${category}`; // Ensures category filter is applied

    const { data } = await axios.get(link, { withCredentials: true }); // Ensures authentication cookies are sent

    dispatch(productsSuccess(data));
  } catch (error) {
    dispatch(productsFail(error.response?.data?.message || "Something went wrong"));
  }
};



// export const getProducts = (keyword = "", page = 1, priceRange = { gte: 0, lte: 2000 }) => async (dispatch) => {
//     try {
//         dispatch(productsRequest());

//         let link = `http://localhost:8000/mfd/products?page=${page}`;
        
//         if (keyword) {
//             link += `&keyword=${keyword}`;
//         }

//         if (priceRange) {
//             link += `&price=${JSON.stringify(priceRange)}`;
//         }

//         const { data } = await axios.get(link, { withCredentials: true });

//         dispatch(productsSuccess(data));
//     } catch (error) {
//         dispatch(productsFail(error.response?.data?.message || "Something went wrong"));
//     }
// };

