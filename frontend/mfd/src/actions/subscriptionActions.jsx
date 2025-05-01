
import axios from "axios";
import { subscriptionRequest, subscriptionSuccess, subscriptionFail, subscriptionDetailRequest, subscriptionDetailSuccess, subscriptionDetailFail } from "../slices/subscription";


export const createSubscriptionAction = (payload) => async (dispatch, getState) => {
  try {
    dispatch(subscriptionRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };

    const { data } = await axios.post('http://localhost:8000/sub/subscription/create', payload, config);

    dispatch(subscriptionSuccess(data)); 

    // Save userId separately if needed
    const { user } = getState().authState;
    if (user && user._id) {
      localStorage.setItem('userId', user._id);
    }

    return data;
    
  } catch (error) {
    dispatch(subscriptionFail(error.response?.data?.message || error.message || 'Subscription Failed'));
    throw error;
  }
};

export const getSubscriptionDetailsAction = (userId) => async (dispatch) =>{
   try {
     
     dispatch(subscriptionDetailRequest());
     const config = {
       headers : {
        "Content-Type":"application/json",
       },
       withCredentials: true,
     };

     const { data } = await axios.post('http://localhost:8000/sub/getSubscriptionDetails',{ userId },config);
     dispatch(subscriptionDetailSuccess(data));
   } catch (error) {
      dispatch(subscriptionDetailFail( error.response?.data?.message || error.message || "Failed to fetch subscription details"));
      throw error;
   }
}

