import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({

    name:'order',
    initialState: {
        orderDetail: {},
        adminOrdersData: [],
        isOrderDeleted: false,
        isOrderUpdated: false,
        isOrderCanceled: false,
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
      adminOrderRequest(state,action){
        return {
            ...state,
            loading: true
        }
      },

      adminOrderSuccess(state,action){
        return {
            ...state,
            loading: false,
            adminOrdersData: action.payload.orders,
            totalamount: action.payload.totalamount
        }
      },
      adminOrderFail(state, action) {
          return {
              ...state,
              loading: false,
              error: action.payload
          }
      },
      deleteOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        deleteOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isOrderDeleted: true
            }
        },
        deleteOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },

        cancelOrderRequest(state,action){
            return {
              ...state,
              loading:true,
            }
        },

        cancelOrderSuccess(state,action){
            return {
            ...state,
            loading: false, 
            isOrderCanceled: true
          }
        },

        cancelOrderFail(state,action){
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        },

        updateOrderRequest(state, action) {
            return {
                ...state,
                loading: true
            }
        },
        updateOrderSuccess(state, action) {
            return {
                ...state,
                loading: false,
                isOrderUpdated: true
            }
        },
        updateOrderFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },

        clearOrderDeleted(state,action){
            return {
                ...state,
                isOrderDeleted: false
            }
        },
        clearOrderUpdated(state,action){
            return {
                ...state,
                isOrderUpdated: false
            }
        },
        clearOrderCancel(state,action){
            return {
               ...state,
               isOrderCanceled: false
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
    createOrderFail,
    adminOrderRequest,
    adminOrderSuccess,
    adminOrderFail,
    deleteOrderRequest,
    deleteOrderSuccess,
    deleteOrderFail,
    updateOrderRequest,
    updateOrderSuccess,
    updateOrderFail,
    clearError,
    clearOrderDeleted,
    clearOrderUpdated,
    cancelOrderFail,
    cancelOrderRequest,
    cancelOrderSuccess,
    clearOrderCancel
} = orderSlice.actions;

export default orderSlice.reducer;