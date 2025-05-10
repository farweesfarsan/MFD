import { createSlice } from "@reduxjs/toolkit";

// Get subscription data from localStorage if available
const subscriptionDataFromStorage = localStorage.getItem('subscriptionData')
  ? JSON.parse(localStorage.getItem('subscriptionData'))
  : null;

const initialState = {
  loading: false,
  data: subscriptionDataFromStorage, 
  subscriptionDetails: null,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    subscriptionRequest(state) {
      return {
        ...state,
        loading: true,
        error: null,
      };
    },
    subscriptionSuccess(state, action) {
      // Save to localStorage whenever success happens
      localStorage.setItem('subscriptionData', JSON.stringify(action.payload));
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
      };
    },
    subscriptionFail(state, action) {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    },
    subscriptionDetailRequest(state,action){
      return {
        ...state,
        loading: false,
        error: null
      }
    },
    subscriptionDetailSuccess(state,action){
      return {
       ...state,
       subscriptionDetails: action.payload,
       error: null
      }
    },
    subscriptionDetailFail(state,action){
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    }
  },
});

const { actions, reducer } = subscriptionSlice;

export const {
  subscriptionRequest,
  subscriptionSuccess,
  subscriptionFail,
  subscriptionDetailRequest,
  subscriptionDetailSuccess,
  subscriptionDetailFail
} = actions;

export default reducer;



