import axios from 'axios';
import { createOrderRequest,createOrderSuccess,createOrderFail, adminOrderRequest, adminOrderSuccess, adminOrderFail, deleteOrderRequest, deleteOrderSuccess, deleteOrderFail, updateOrderRequest, updateOrderSuccess, updateOrderFail, cancelOrderRequest,cancelOrderSuccess,cancelOrderFail} from '../slices/orderSlice';


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

export const adminOrders = () => async (dispatch) => {
    try {
      dispatch(adminOrderRequest());
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
      };
  
      const { data } = await axios.get(`http://localhost:8000/order/admin/getAllOrders`,config);
  
      dispatch(adminOrderSuccess(data));
    } catch (error) {
      dispatch(adminOrderFail(error.response?.data?.message || error.message));
    }
  };

export const deleteOrder = id => async (dispatch) => {
    try {
      dispatch(deleteOrderRequest());
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
      };
      await axios.delete(`http://localhost:8000/order/admin/${id}`,config);
      dispatch(deleteOrderSuccess());
    } catch (error) { 
      dispatch(deleteOrderFail(error.response?.data?.message || error.message));
    }
  };

export const updateOrder = (id,orderData) => async (dispatch) => {
    try {
      dispatch(updateOrderRequest());
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
      };
      const { data } = await axios.put(`http://localhost:8000/order/admin/${id}`, orderData, config);
      dispatch(updateOrderSuccess(data));
    } catch (error) {
      dispatch(updateOrderFail(error.response?.data?.message || error.message));
    }
  };

  export const cancelOrder = (id,reason) => async (dispatch) => {
    try {
      dispatch(cancelOrderRequest());
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
      };
      const { data } = await axios.put(`http://localhost:8000/order/cancelOrder/${id}`,{ reason },config);
      dispatch(cancelOrderSuccess(data));
    } catch (error) {
      dispatch(cancelOrderFail(error.response?.data?.message || error.message));
    }
  };