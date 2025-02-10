import { Mail } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, copyToClipboard, LoadingLabel } from '../../assets/CustomComponents';
import { resend2faService, resendOTPService, verify2faService, verifyOTPService } from '../../services/authService';
import { loadUser } from '../../store/actions/authActions';
import { LOGIN_SUCCESS } from '../../store/types';

const OTPVerification = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const inputRefs = useRef([]);
    const lastSubmittedOtpRef = useRef('');
    const { email, action } = location.state || {};

    useEffect(() => {
        if (!email) {
            toast.error(action ? 'User email not found. Please try logging in again.' : 'No valid email provided. Please register first.');
            navigate(action ? '/login' : '/register');
        }
    }, [email, navigate, action]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtpArray = [...otpArray];
        newOtpArray[index] = element.value;
        setOtpArray(newOtpArray);

        if (element.value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        if (!/^\d+$/.test(pastedData)) {
            toast.error('Please paste numbers only');
            return;
        }

        const pastedArray = pastedData.slice(0, 6).split('');

        const newOtpArray = [...otpArray];
        pastedArray.forEach((value, index) => {
            if (index < 6) {
                newOtpArray[index] = value;
            }
        });

        setOtpArray(newOtpArray);

        const nextEmptyIndex = newOtpArray.findIndex(value => !value);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOTP = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const otp = otpArray.join('');

        if (otp.length !== 6) {
            toast.error('Please enter the complete OTP');
            return;
        }

        setLoading(true);

        try {
            let response;
            if (action) {
                response = await verify2faService(email, otp, action);
            } else {
                response = await verifyOTPService(email, otp);
            }

            if (response.data?.success) {
                if (!action || action === 'login') {
                    dispatch({ type: LOGIN_SUCCESS, payload: response.data.user });
                }
                dispatch(loadUser());
                toast.success(
                    <div onClick={() => copyToClipboard(email)} className='cursor-pointer'>
                        {response.data.message}
                    </div>,
                    { autoClose: false }
                );
                navigate('/');
            } else {
                toast.error(response.data.message || 'OTP verification failed.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'OTP verification failed.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);

        try {
            let response;
            if (action) {
                response = await resend2faService(email, action);
            } else {
                response = await resendOTPService(email);
            }
            toast.success(response.data.message);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
            toast.error(errorMessage);
        } finally {
            setResendLoading(false);
        }
    };

    const bodyMessage = action
        ? action === 'enable'
            ? `We've sent a code to <strong>${email}</strong> to enable Two-Factor Authentication`
            : action === 'disable'
                ? `We've sent a code to <strong>${email}</strong> to disable Two-Factor Authentication`
                : `We've sent a code to <strong>${email}</strong>. Please verify it in order to log in`
        : `We've sent a code to <strong>${email}</strong>`;

    useEffect(() => {
        const otp = otpArray.join('');
        if (otp.length === 6 && otp !== lastSubmittedOtpRef.current && !loading) {
            lastSubmittedOtpRef.current = otp;
            handleVerifyOTP();
        }
    }, [otpArray, loading]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-stone-100 p-3 rounded-full">
                        <Mail className="w-6 h-6 text-stone-600" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
                    <p className="text-stone-600" dangerouslySetInnerHTML={{ __html: bodyMessage }}></p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="flex justify-between gap-2">
                        {otpArray.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={el => inputRefs.current[idx] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleChange(e.target, idx)}
                                onKeyDown={e => handleKeyDown(e, idx)}
                                onPaste={idx === 0 ? handlePaste : undefined}
                                className="w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 border-gray-200 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 transition-all duration-200 outline-none"
                            />
                        ))}
                    </div>

                    <BrownButton
                        type="submit"
                        disabled={loading || otpArray.includes('')}
                        className="w-full text-white py-10 h-full px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LoadingLabel loading={loading} defaultLabel={action ? 'Verify' : 'Verify Email'} loadingLabel='Verifying' />
                    </BrownButton>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Didn't receive the code?{' '}
                            <Button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resendLoading}
                                className="text-stone-600 hover:text-stone-700 font-medium transition-colors hover:underline"
                            >
                                <LoadingLabel loading={resendLoading} defaultLabel='Resend' loadingLabel='Resending' />
                            </Button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification;