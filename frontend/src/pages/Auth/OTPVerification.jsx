import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OTPForm, OTPHeader } from '../../components/custom/Profile';
import { resend2faService, resendOTPService, verify2faAuthService, verifyOTPService, verifySocialLogin2FAService } from '../../services/authService';
import { loadUser } from '../../store/actions/authActions';

const OTPVerification = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const inputRefs = useRef([]);
    const lastSubmittedOtpRef = useRef('');

    const email = location.state?.email || searchParams.get('email');
    const action = location.state?.action || searchParams.get('action');
    const isSocialLogin = location.state?.social || searchParams.get('social') === 'true';
    const tempToken = location.state?.temp || searchParams.get('temp');

    const methodsParam = searchParams.get('methods');
    const twoFactorMethods = location.state?.twoFactorMethods || (methodsParam ? JSON.parse(decodeURIComponent(methodsParam)) : []);

    const isAuthenticator = location.state?.isAuthenticator || twoFactorMethods.includes('authenticator');

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
        const value = element.value.toUpperCase();
        const newOtpArray = [...otpArray];
        newOtpArray[index] = value;
        setOtpArray(newOtpArray);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim().toUpperCase();

        if (!/^[A-Z0-9]+$/.test(pastedData)) {
            toast.error('Please paste numbers and letters only');
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
        if (e?.preventDefault) e.preventDefault();
        const otp = otpArray.join('');

        if (otp.length !== 6) {
            toast.error('Please enter the complete OTP');
            return;
        }

        setLoading(true);

        try {
            let response;
            const isRegistration = !action && twoFactorMethods.length === 0;
            const isNumericCode = /^\d{6}$/.test(otp);
            const usingAuthenticator = twoFactorMethods.includes('authenticator');
            const usingEmail = twoFactorMethods.includes('email');

            switch (true) {
                case isSocialLogin && tempToken: {
                    const isAuthenticatorVerification = usingAuthenticator && isNumericCode;

                    response = await verifySocialLogin2FAService({
                        email,
                        otp,
                        tempToken,
                        isAuthenticator: isAuthenticatorVerification
                    });
                    break;
                }
                case isRegistration: {
                    response = await verifyOTPService(email, otp);
                    break;
                }
                case usingAuthenticator && isNumericCode:
                case isNumericCode && twoFactorMethods.length === 0: {
                    response = await verify2faAuthService(email, otp, action || 'login');
                    break;
                }
                case action === 'disable' && isAuthenticator && isNumericCode: {
                    response = await verify2faAuthService(email, otp, action, true);
                    break;
                }
                case action === 'enable' && isAuthenticator && isNumericCode: {
                    response = await verify2faAuthService(email, otp, action, true);
                    break;
                }
                case action === 'disable' || action === 'enable': {
                    response = await verifyOTPService(email, otp, action);
                    break;
                }
                case usingEmail: {
                    response = await verifyOTPService(email, otp, action);
                    break;
                }
                default: {
                    throw new Error('No valid verification method found');
                }
            }

            if (response.data?.success) {
                dispatch(loadUser());
                toast.success(response.data.message || 'Verification successful');
                navigate('/');
            } else {
                toast.error(response.data?.message || 'OTP verification failed.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'OTP verification failed.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (isAuthenticator && !twoFactorMethods.includes('email')) {
            toast.info("Authenticator codes refresh automatically. Please check your app");
            return;
        }

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

    const showBoth = twoFactorMethods.includes('email') && twoFactorMethods.includes('authenticator');
    const showAuth = twoFactorMethods.includes('authenticator');

    const title = isSocialLogin
        ? 'Social Login Verification'
        : showBoth
            ? 'Two-Factor Verification'
            : isAuthenticator
                ? 'Authenticator Verification'
                : 'Verify Your Email';

    const body = (() => {
        if (isSocialLogin) {
            if (showBoth) return `Please enter the verification code from either your email or authenticator app for <strong>${email}</strong>`;
            if (showAuth) return `Please enter the code from your authenticator app for <strong>${email}</strong>`;
            return `Please enter the verification code sent to <strong>${email}</strong> to complete your social login`;
        }

        if (showBoth) return `Please enter the verification code from either your email or authenticator app for <strong>${email}</strong>`;
        if (isAuthenticator) return `Please enter the code from your authenticator app for <strong>${email}</strong>`;
        if (action === 'login') return `Please enter the verification code for <strong>${email}</strong>`;
        if (action === 'enable') return `We've sent a code to <strong>${email}</strong> to enable Two-Factor Authentication`;
        if (action === 'disable') return `We've sent a code to <strong>${email}</strong> to disable Two-Factor Authentication`;
        if (action) return `We've sent a code to <strong>${email}</strong>. Please verify it in order to log in`;
        return `We've sent a code to <strong>${email}</strong>`;
    })();

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
                <OTPHeader
                    isAuthenticator={isAuthenticator}
                    twoFactorMethods={twoFactorMethods}
                    title={title}
                    body={body}
                />

                <OTPForm
                    otpArray={otpArray}
                    inputRefs={inputRefs}
                    handleChange={handleChange}
                    handleKeyDown={handleKeyDown}
                    handlePaste={handlePaste}
                    handleVerifyOTP={handleVerifyOTP}
                    loading={loading}
                    isSocialLogin={isSocialLogin}
                    action={action}
                    twoFactorMethods={twoFactorMethods}
                    handleResendOTP={handleResendOTP}
                    resendLoading={resendLoading}
                />
            </div>
        </div>
    );
};

export default OTPVerification;