import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updatePassword as updatePasswordAction, resetUpdateState } from '../../actions/usersActions';

const UpdatePassword = () => {
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const dispatch = useDispatch();
    const { isUpdatedPass, error } = useSelector(state => state.authState);

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('oldPassword', oldPassword);
        formData.append('password', password);
        dispatch(updatePasswordAction(formData));
    };

    useEffect(() => {
        if (isUpdatedPass) {
            toast.success('Password Updated Successfully!', {
                position: 'bottom-center',
                theme: 'dark',
                autoClose: 5000
            });

            setOldPassword("");
            setPassword("");

            // Reset isUpdated state after toast
            dispatch(resetUpdateState());
        }

        if (error) {
            toast.error(error, {
                position: "bottom-center",
                autoClose: 5000,
                theme: "dark",
            });
        }
    }, [isUpdatedPass, error, dispatch]);

    return (
        <div className="flex justify-center items-center py-12 px-4 w-full max-w-full">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <form onSubmit={submitHandler} className="space-y-6">
                    <h1 className="text-2xl font-semibold text-center">New Password</h1>

                    <div>
                        <label htmlFor="password_field" className="block text-sm font-medium text-gray-700">Old Password</label>
                        <input
                            type="password"
                            id="password_field"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm_password_field" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        id="new_password_button"
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
