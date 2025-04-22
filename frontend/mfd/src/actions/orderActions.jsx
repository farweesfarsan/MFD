import axios from 'axios';
import { createOrderRequest,createOrderSuccess,createOrderFail } from '../slices/orderSlice';


export const createOrder = (order) => async (dispatch) => {
    try {
      dispatch(createOrderRequest());
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
      };
  
      const { data } = await axios.post(`http://localhost:8000/order/newOrder`, order, config);
  
      dispatch(createOrderSuccess(data));
    } catch (error) {
      console.error("Error from createOrder:", error); 
      dispatch(createOrderFail(error.response?.data?.message || error.message));
    }
  };