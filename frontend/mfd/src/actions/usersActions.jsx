import axios from "axios";
import { loginFail, loginRequest, loginSuccess, clearErrors, registerRequest, registerSuccess, registerFail, loadUserRequest,loadUserSuccess,loadUserFail, logoutSuccess, logoutFail, updateProfileRequest, updateProfileSuccess, updateProfileFail, updatePasswordRequest, updatePasswordSuccess, updatePasswordFail, resetUpdate, forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFail, resetPasswordRequest, resetPasswordSuccess, resetPasswordFail, sendOtpRequest, sendOtpSuccess, sendOtpFail, sendEmailRequest, sendEmailSuccess, sendEmailFail } from "../slices/authSlice";
import { usersRequest,usersSuccess,usersFail,userRequest,userSuccess,userFail,deleteUserRequest,deleteUserSuccess,deleteUserFail,updateUserRequest,updateUserSuccess,updateUserFail } from "../slices/userSlice";

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest());

        const { data } = await axios.post(
            "http://localhost:8000/user/userLogin",
            { email, password },
            { withCredentials: true } // Enable cookies
        );

        dispatch(loginSuccess(data));
    } catch (error) {
        dispatch(loginFail(error.response?.data?.message || "Login failed"));
    }
};

export const clearAuthErrors = () => (dispatch) => {
    dispatch(clearErrors());
};

export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest());  

        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post("http://localhost:8000/user/register", userData, config);
        dispatch(registerSuccess(data));  
    } catch (error) {
        dispatch(registerFail(error.response?.data?.message || "Login failed")); 
    }
};


export const loadUser =  async (dispatch) => {
    try {
        dispatch(loadUserRequest());
        
        const { data } = await axios.get("http://localhost:8000/user/myProfile", { 
            withCredentials: true  // Ensures cookies are sent with the request
        });

        dispatch(loadUserSuccess(data));
    } catch (error) {
        dispatch(loadUserFail(error.response?.data?.message || "Failed to load user"));
    }
};

export const logoutUser =  async (dispatch) => {
    try {
         await axios.get("http://localhost:8000/user/userLogout", { 
            withCredentials: true  // Ensures cookies are sent with the request
        });

        dispatch(logoutSuccess());
    } catch (error) {
        dispatch(logoutFail());
    }
};

export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest());

        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            },
            withCredentials: true
        };

        const { data } = await axios.put(`http://localhost:8000/user/update`, userData, config);
        dispatch(updateProfileSuccess(data));

    } catch (error) {
        dispatch(updateProfileFail(error.response?.data?.message || "Update failed"));
    }
};

export const updatePassword = (formData) => async (dispatch) => {
    try {
        dispatch(updatePasswordRequest());

        const config = {
            headers: {
                'Content-type': 'application/json'
            },
            withCredentials: true
        };

        await axios.put("http://localhost:8000/user/password/change", formData, config);
        dispatch(updatePasswordSuccess());
        
    } catch (error) {
        dispatch(updatePasswordFail(error.response?.data?.message || "Update Password failed"));
    }
};

export const resetUpdateState = () => (dispatch) => {
    dispatch(resetUpdate());
};

export const forgotPassword = (formData) => async (dispatch) => {
    try {
        dispatch(forgotPasswordRequest());

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        };

        const { data } = await axios.post("http://localhost:8000/user/password/forgot", formData, config);

        dispatch(forgotPasswordSuccess({ message: data.message })); 
    } catch (error) {
        dispatch(forgotPasswordFail(error.response?.data?.message || "Something went wrong!"));
    }
};


export const resetPassword = (formData,token) => async (dispatch) => {
    try {
        dispatch(resetPasswordRequest());

        const config = {
            headers: {
                'Content-type': 'application/json'
            },
            withCredentials: true
        };

        await axios.post(`http://localhost:8000/user/password/reset/${token}`, formData, config);
        dispatch(resetPasswordSuccess());
        
    } catch (error) {
        dispatch(resetPasswordFail(error.response?.data?.message ));
    }
};

export const sendOtp = (email) => async (dispatch) => {
    try {
        dispatch(sendOtpRequest());

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        const { data } = await axios.post(
            "http://localhost:8000/user/sendOtp",
            { email },
            config
        );

        dispatch(sendOtpSuccess(data));
        // dispatch(resetUpdate());  
    } catch (error) {
        dispatch(sendOtpFail(error.response?.data?.message || "Failed to send OTP"));
    }
};

export const getAllUsers =  async (dispatch) => {
    try {
        dispatch(usersRequest());
        
        const { data } = await axios.get("http://localhost:8000/user/admin/users", { 
            withCredentials: true  // Ensures cookies are sent with the request
        });

        dispatch(usersSuccess(data));
    } catch (error) {
        dispatch(usersFail(error.response?.data?.message || "Failed to load user"));
    }
};

export const sendEmail = (formData) => async (dispatch) => {
    try {
        dispatch(sendEmailRequest());

        const { data } = await axios.post("http://localhost:8000/invoice/send-invoice", formData, {
            withCredentials: true
        });

        dispatch(sendEmailSuccess({ message: data.message })); 
    } catch (error) {
        dispatch(sendEmailFail(error.response?.data?.message || "Something went wrong!"));
    }
};

export const getUser = id =>  async (dispatch) => {
    try {
        dispatch(userRequest());
        
        const { data } = await axios.get(`http://localhost:8000/user/admin/users/${id}`, { 
            withCredentials: true  // Ensures cookies are sent with the request
        });

        dispatch(userSuccess(data));
    } catch (error) {
        dispatch(userFail(error.response?.data?.message || "Failed to load user"));
    }
};



export const deleteUser = id =>  async (dispatch) => {
    try {
        dispatch(deleteUserRequest());
        
        await axios.delete(`http://localhost:8000/user/admin/users/${id}`, { 
            withCredentials: true  // Ensures cookies are sent with the request
        });

        dispatch(deleteUserSuccess());
    } catch (error) {
        dispatch(deleteUserFail(error.response?.data?.message || "Failed to load user"));
    }
};

export const updateUser = (id, formData) => async (dispatch) => {

    try {
        dispatch(updateUserRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            },
            withCredentials: true
        }
        await axios.put(`http://localhost:8000/user/admin/users/${id}`, formData,config );
        dispatch(updateUserSuccess())
    } catch (error) {
        dispatch(updateUserFail(error.response.data.message))
    }

}


