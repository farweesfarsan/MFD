

// export default reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialItems = localStorage.getItem('cartItem')
  ? JSON.parse(localStorage.getItem('cartItem'))
  : [];

const initialDeliveryInfo = localStorage.getItem('deliveryInfo')
  ? JSON.parse(localStorage.getItem('deliveryInfo'))
  : {};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: initialItems,
    loading: false,
    deliveryInfo: initialDeliveryInfo,
  },
  reducers: {
    addCartItemRequest(state) {
      state.loading = true;
    },

    addCartItemSuccess(state, action) {
      const item = action.payload;
      const existingItemIndex = state.items.findIndex(i => i.product === item.product);

      if (existingItemIndex === -1) {
        state.items.push(item);
      }

      localStorage.setItem('cartItem', JSON.stringify(state.items));
      state.loading = false;
    },

    increaseCartItemQty(state, action) {
      const index = state.items.findIndex(item => item.product === action.payload);
      if (index !== -1 && state.items[index].quantity < state.items[index].stock) {
        state.items[index].quantity += 1;
        localStorage.setItem('cartItem', JSON.stringify(state.items));
      }
    },

    decreaseCartItemQty(state, action) {
      const index = state.items.findIndex(item => item.product === action.payload);
      if (index !== -1 && state.items[index].quantity > 1) {
        state.items[index].quantity -= 1;
        localStorage.setItem('cartItem', JSON.stringify(state.items));
      }
    },

    removeItemFromCart(state, action) {
      state.items = state.items.filter(item => item.product !== action.payload);
      localStorage.setItem('cartItem', JSON.stringify(state.items));
    },

    saveDeliveryInfo(state, action) {
      state.deliveryInfo = action.payload;
      localStorage.setItem('deliveryInfo', JSON.stringify(action.payload));
    },

    orderCompleted(state,actions) {
      localStorage.removeItem('deliveryInfo');
      localStorage.removeItem('cartItem');
      sessionStorage.removeItem('orderInfo');
      return {
        items: [],
        loading: false,
        deliveryInfo: {}
      }
    }
  },
});

export const {
  addCartItemRequest,
  addCartItemSuccess,
  increaseCartItemQty,
  decreaseCartItemQty,
  removeItemFromCart,
  saveDeliveryInfo,
  orderCompleted
} = cartSlice.actions;

export default cartSlice.reducer;

