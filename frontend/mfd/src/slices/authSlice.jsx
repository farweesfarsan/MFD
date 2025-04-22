import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "users",
    initialState: {
        loading: true,
        authenticatedUser: false,
        isUpdated: false,
        isUpdatedPass:false,
        otpSent: false, 
        otp: null,
        otpMessage: null,
        otpSuccess:null,
        otpExpireDate:null,
        error:null
    },
    reducers: {
        loginRequest(state) {
            return {
                ...state,
                loading: true,  
                userLogged: false,
                error: null,
            };
        },
        loginSuccess(state, action) {
            return {
                loading: false,  
                authenticatedUser: true,
                userLogged: true,
                user: action.payload.user,
                error: null,
            };
        },
        loginFail(state, action) {
            return {
                ...state,
                loading: false,  
                error: action.payload,
            };
        },
        clearErrors(state) {
            return {
                ...state,
                error: null,
            };
        },

        registerRequest(state) {
            return {
                ...state,
                loading: true,  
                error: null,
            };
        },
        registerSuccess(state, action) {
            return {
                loading: false,  
                authenticatedUser: true,
                user: action.payload.user,
                error: null,
            };
        },
        registerFail(state, action) {
            return {
                ...state,
                loading: false,  
                error: action.payload,
            };
        },
        loadUserRequest(state) {
            return {
                ...state,
                authenticatedUser: false,
                loading: true,
            };
        },
        loadUserSuccess(state, action) {
            return {
                loading: false,
                authenticatedUser: true,
                user: action.payload.user,
            };
        },
        loadUserFail(state) {
            return {
                ...state,
                loading: false,
            };
        },
        logoutSuccess(state) {
            return {
                loading: false,
                authenticatedUser: false,
            };
        },
        logoutFail(state, action) {
            return {
                ...state,
                error: action.payload,
            };
        },
        updateProfileRequest(state) {
            return {
                ...state,
                loading: true,
                isUpdated: false,
            };
        },
        updateProfileSuccess(state, action) {
            return {
                ...state,
                loading: false,
                user: action.payload.user,
                isUpdated: true,
            };
        },
        updateProfileFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        },
        updatePasswordRequest(state) {
            return {
                ...state,
                loading: true,
                isUpdatedPass: false,
            };
        },
        updatePasswordSuccess(state) {
            return {
                ...state,
                loading: false,
                isUpdatedPass: true,
            };
        },
        updatePasswordFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        },
        
        forgotPasswordRequest(state) {
            return {
                ...state,
                loading: true,
                isUpdated: false,
                message:null
            };
        },
        forgotPasswordSuccess(state,action) {
            return {
                ...state,
                loading: false,
                message: action.payload.message
            };
        },
        forgotPasswordFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        },
        resetPasswordRequest(state) {
            return {
                ...state,
                loading: true
            };
        },
        resetPasswordSuccess(state, action) {
            return {
                ...state,
                loading: false,
                authenticatedUser: true,  // Ensure user is marked as authenticated
                user: action.payload?.user || state.user, // Ensure user data is stored
                isUpdated: true, // Indicate update success
            };
        },
        
        resetPasswordFail(state, action) {
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        },
        sendOtpRequest(state) {
            if (state.loading) return state; // Prevent multiple dispatches if already loading
            
            return {
                ...state,
                loading: true,
                otpSent: false,
                otpMessage: null,
                otpSuccess: null,
                otp: null,
                otpExpireDate: null,
                error: null,
            };
        },
        
        sendOtpSuccess(state, action) {
            return {
                ...state,
                loading: false,
                otpSent: true,
                otpMessage: action.payload.message,
                otpSuccess: action.payload.success,
                otp: action.payload.otp,
                otpExpireDate:action.payload.otpExpireDate,
                error: null,
            };
        },
        sendOtpFail(state, action) {
            return {
                ...state,
                loading: false,
                otpSent: false,
                error: action.payload,
            };
        },
        resetUpdate(state) {
            return {
                ...state,
                isUpdated: false,
                otpSent:false,
                message:null,
                error:null,
                isUpdatedPass:false
            };
        }
        
    },
});

const { actions, reducer } = authSlice;

export const { 
    loginRequest, 
    loginSuccess, 
    loginFail, 
    clearErrors,
    registerRequest,
    registerSuccess,
    registerFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    resetUpdate,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail,
    sendOtpRequest,
    sendOtpSuccess,
    sendOtpFail
} = actions; 

export default reducer;


