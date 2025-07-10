import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        loading: false,
        isReviewDeleted: false,
        isProductCreated: false,
        isReviewSubmitted:false,
        isProductDeleted:false,
        isProductUpdated: false,
        reviews: []
        // products: {},
        // error:null
    },
    reducers: {
        productRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        productSuccess(state, action){
            return {
                ...state,
                loading: false,
                product: action.payload.product
               
            }
        },
        productFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload
            }
        },
        createReviewRequest(state,action){
            return {
                ...state,
                loading: true
            }
        },
        createReviewSuccess(state,action){
            return {
                ...state,
                loading: false,
                isReviewSubmitted: true
            }
        },
        createReviewFail(state,action){
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        },
        clearReviewSubmitted(state,action){
            return {
                ...state,
                isReviewSubmitted: false
            }
        },
        clearError(state, action){
            return {
                ...state,
                error: null
            }
        },
        newProductRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        newProductSuccess(state, action){
            return {
                ...state,
                loading: false,
                product: action.payload.product,
                isProductCreated: true   
            }
        },
        newProductFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload,
                isProductCreated: false
            }
        }
        ,
        clearProductCreater(state,action){
            return {
                ...state,
                isProductCreated: false
            }
        },
        deleteProductRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        deleteProductSuccess(state, action){
            return {
                ...state,
                loading: false,
                isProductDeleted: true
            }
        },
        deleteProductFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload,
            }
        },
        clearProductDelete(state, action) {
            return {
                ...state,
                isProductDeleted: false
            }
        },
        updateProductRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        updateProductSuccess(state, action){
            return {
                ...state,
                loading: false,
                product: action.payload.product,
                isProductUpdated: true
            }
        },
        updateProductFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload,
            }
        },
        clearProductUpdated(state, action) {
            return {
                ...state,
                isProductUpdated: false
            }
        },
        reviewRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        reviewSuccess(state, action){
           return {
               ...state,
               loading: false,
               reviews: action.payload.reviews  
             }
        },
        reviewFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload
            }
        },
        deleteReviewRequest(state, action){
            return {
                ...state,
                loading: true
            }
        },
        deleteReviewSuccess(state, action){
            return {
                ...state,
                loading: false,
                isReviewDeleted: true
            }
        },
        deleteReviewFail(state, action){
            return {
                ...state,
                loading: false,
                error:  action.payload,
            }
        },
        clearReviewDelete(state, action) {
            return {
                ...state,
                isReviewDeleted: false
            }
        },
//         getAllReviewsSuccess(state, action) {
//   return {
//     ...state,
//     loading: false,
//     reviews: action.payload,
//   };
// },
// getAllReviewsFail(state, action) {
//   return {
//     ...state,
//     loading: false,
//     error: action.payload,
//   };
// }

    }
});

const { actions, reducer } = productSlice;

export const { 
    productRequest, 
    productSuccess, 
    productFail,
    createReviewRequest,
    createReviewSuccess,
    createReviewFail,
    clearReviewSubmitted,
    clearError,
    newProductRequest,
    newProductSuccess,
    newProductFail,
    clearProductCreater,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFail,
    clearProductDelete,
    updateProductRequest,
    updateProductSuccess,
    updateProductFail,
    clearProductUpdated,
    deleteReviewRequest,
    deleteReviewSuccess,
    deleteReviewFail,
    clearReviewDelete,
    reviewRequest,
    reviewSuccess,
    reviewFail
//     getAllReviewsSuccess,
//   getAllReviewsFail
} = actions;

export default reducer;
