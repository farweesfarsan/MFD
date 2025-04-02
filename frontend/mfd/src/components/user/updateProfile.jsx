import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile, loadUser } from "../../actions/usersActions";
import { updateProfileSuccess } from "../../slices/authSlice";
import { resetUpdate } from '../../slices/authSlice';

const UpdateProfile = () => {
    const { error, user, isUpdated } = useSelector(state => state.authState);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/user/user.png");
    const dispatch = useDispatch();

    const onChangeAvatar = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(e.target.files[0]);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('avatar', avatar);

        console.log("Sending User Data:", Object.fromEntries(formData.entries())); // Debugging log

        dispatch(updateProfile(formData));
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }

        if (isUpdated) {
            toast('Profile Updated Successfully!', {
                type: 'success',
                position: 'bottom-center',
                theme: 'dark',
                autoClose: 5000
            });
           
            dispatch(resetUpdate());
        }

        if (error) {
            toast.error(error, {
                position: "bottom-center",
                autoClose: 5000,
                theme: "dark",
            });
            return
        }
    }, [user, isUpdated, error, dispatch]);

    return (
        <div className="flex justify-center items-center py-12   px-4 w-full max-w-full">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <form onSubmit={submitHandler} className="space-y-4" encType='multipart/form-data'>
                    <h1 className="text-2xl font-bold text-center text-gray-700">Update Profile</h1>

                    <div>
                        <label htmlFor="name_field" className="block text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                            name='name'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="email_field" className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                            name='email'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor='avatar_upload' className="block text-gray-700 font-medium">Avatar</label>
                        <div className='flex items-center gap-4 mt-2'>
                            <div className='w-16 h-16 rounded-full overflow-hidden border border-gray-300'>
                                <img src={avatarPreview} alt='Avatar Preview' className='w-full h-full object-cover' />
                            </div>
                            <div>
                                <input
                                    type='file'
                                    name='avatar'
                                    className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600'
                                    id='customFile'
                                    onChange={onChangeAvatar}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProfile;
