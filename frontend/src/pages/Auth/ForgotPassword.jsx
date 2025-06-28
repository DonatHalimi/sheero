import { Typography } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingLabel } from '../../components/custom/LoadingSkeletons';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal } from '../../components/custom/MUI';
import { forgotPasswordService } from '../../services/authService';
import { EMAIL_VALIDATION } from '../../utils/constants/user';

const ForgotPassword = ({ open, onClose }) => {
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [errorVisible, setErrorVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (v) => EMAIL_VALIDATION.regex.test(v);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await forgotPasswordService(email);
            toast.success(res.data.message);
            setEmail('');
            onClose();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { value } = e.target;

        setEmail(value);
        const isValid = validateEmail(value);
        setIsValidEmail(isValid);
        setErrorVisible(!isValid);
    }

    const handleBlur = () => {
        if (!isValidEmail) {
            setErrorVisible(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <Typography variant="h6" align="left" className="!mb-2 text-stone-600">
                    Forgot Password
                </Typography>

                <p className="mb-2">
                    Provide the email address associated with your account to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <BrownOutlinedTextField
                        label="Email"
                        fullWidth
                        required
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="!mt-3 !mb-4"
                    />

                    {!isValidEmail && email && errorVisible && (
                        <div className="absolute bottom-[11px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-[calc(100%-30px)]  z-10">
                            <span className="block text-xs font-semibold mb-1">{EMAIL_VALIDATION.title}</span>
                            {EMAIL_VALIDATION.message}
                            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                        </div>
                    )}

                    <BrownButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={!isValidEmail || loading}
                        className="mt-4"
                    >
                        <LoadingLabel loading={loading} defaultLabel='Send Reset Link' loadingLabel='Sending' />
                    </BrownButton>
                </form>
            </CustomBox>
        </CustomModal>
    );
};

export default ForgotPassword;