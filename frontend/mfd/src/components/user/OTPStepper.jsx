import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, register, registerStaff } from '../../actions/usersActions';

const OTPStepper = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { userData, avatar, userType } = location.state || {};
    const { loading, error, otp, otpExpireDate } = useSelector(state => state.authState);
    
    const [otpValues, setOtpValues] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(360); // 6-minute countdown
    const [canResend, setCanResend] = useState(false);
    const inputRefs = Array(4).fill(0).map(() => React.createRef());

    // Convert expiry time to a Date object
    const expiryTime = otpExpireDate ? new Date(otpExpireDate).getTime() : null;

    // Countdown timer for OTP expiration
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prevTime => {
                    if (prevTime <= 1) {
                        setCanResend(true);
                        toast.error('OTP has expired. Please request a new one.', {
                            theme: 'dark',
                            position: 'bottom-center',
                        });
                        clearInterval(interval);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Check if OTP is expired and prevent verification
    useEffect(() => {
        if (expiryTime && Date.now() > expiryTime) {
            setCanResend(true);
            toast.error('OTP has expired. Please request a new one.', {
                theme: 'dark',
                position: 'bottom-center',
            });
        }
    }, [expiryTime]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Handle OTP input change
    const handleChange = (index, value) => {
        if (/\d/.test(value) || value === '') {
            const newOtpValues = [...otpValues];
            newOtpValues[index] = value;
            setOtpValues(newOtpValues);
            
            // Auto-focus next input
            if (value && index < 3) {
                inputRefs[index + 1].current.focus();
            }
        }
    };

    // Handle backspace navigation
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = () => {
        if (expiryTime && Date.now() > expiryTime) {
            toast.error('OTP has expired. Please request a new one.', {
                theme: 'dark',
                position: "bottom-center",
            });
            return;
        }

        const enteredOTP = otpValues.join('');
        if (enteredOTP === otp?.toString()) {
            const formData = new FormData();
            // formData.append('name', userData.name);
            // formData.append('email', userData.email);
            // formData.append('password', userData.password);
            // formData.append('avatar', avatar);

            if(userType === "deliveryStaff"){
                formData.append('name',userData.name);
                formData.append('password',userData.password);
                formData.append('avatar',userData.avatar);
                formData.append('email',userData.email);
                formData.append('nic', userData.nic);
                formData.append('mobileNo', userData.mobileNo);
                formData.append('address', userData.address);
            }

            if(userType === "user"){
                formData.append('name',userData.name);
                formData.append('password',userData.password);
                formData.append('avatar',userData.avatar);
                formData.append('email',userData.email);
            }

           let registrationAction;
             switch(userType) {
                case 'user':
                registrationAction = register;
                break;

                case 'deliveryStaff':
                registrationAction = registerStaff
             } 

            dispatch(registrationAction(formData))
                .then((res) => {
        navigate('/');
        window.location.reload();
    })
                .catch((error) => {
                    toast.error(error.message || 'Registration failed.', {
                        theme: 'dark',
                        position: 'bottom-center',
                    });
                });
        } else {
            toast.error('Invalid OTP! Please try again.', {
                theme: 'dark',
                position: 'bottom-center',
            });
        }
    };

    // Handle OTP resend
    const handleResendOtp = async () => {
        setTimer(360);
        setCanResend(false);
        setOtpValues(['', '', '', '']); // Clear input fields

        await dispatch(sendOtp(userData.email)); // Ensure OTP state updates

        toast.info('A new OTP has been sent!', {
            theme: 'dark',
            position: 'bottom-center',
        });
    };

    return (
        <div className="flex flex-col items-center space-y-6 p-6 shadow-lg rounded-lg bg-white w-96 mx-auto mt-10">
            <h2 className="text-2xl font-bold text-gray-700">Enter OTP</h2>
            <div className="flex space-x-3">
                {otpValues.map((digit, index) => (
                    <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ))}
            </div>
            <button
                onClick={handleVerifyOtp}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg w-full"
                disabled={expiryTime && Date.now() > expiryTime}
            >
                Verify OTP
            </button>
            <p className="text-sm text-gray-500">
                Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </p>
            {canResend && (
                <button
                    onClick={handleResendOtp}
                    className="text-blue-500 underline text-sm"
                >
                    Resend OTP
                </button>
            )}
        </div>
    );
};

export default OTPStepper;
