import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({

    name:'order',
    initialState: {
        orderDetail: {},
        loading: false,
    },

    reducers: {
      createOrderRequest(state,action){
        return {
            ...state,
            loading: true
        }
      },

      createOrderSuccess(state,action){
        return {
            ...state,
            loading: false,
            orderDetail: action.payload.order
        }
      },
      createOrderFail(state, action) {
          return {
              ...state,
              loading: false,
              error: action.payload
          }
      },
      clearError(state, action) {
          return {
              ...state,
              error: null
          }
      }
    }
   
});

export const {
    createOrderRequest,
    createOrderSuccess,
    createOrderFail
} = orderSlice.actions;

export default orderSlice.reducer;