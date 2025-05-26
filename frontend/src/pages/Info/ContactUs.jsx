import { Container, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { LoadingLabel } from '../../components/custom/LoadingSkeletons';
import { BrownButton, ErrorTooltip } from '../../components/custom/MUI';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { addContactService } from '../../services/contactService';
import { EMAIL_VALIDATION, MESSAGE_VALIDATION, NAME_VALIDATION, SUBJECT_VALIDATION } from '../../utils/constants/validations/contact';

const ContactUs = () => {
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const subjectRef = useRef(null);

    useEffect(() => {
        setFormData({
            name: user?.firstName || '',
            email: user?.email || '',
            subject: '',
            message: ''
        });
        user && subjectRef.current?.focus();
    }, [user]);

    const validateField = (name, value) => {
        const rules = {
            name: NAME_VALIDATION.regex,
            email: EMAIL_VALIDATION.regex,
            subject: SUBJECT_VALIDATION.regex,
            message: MESSAGE_VALIDATION.regex
        };
        return rules[name]?.test(value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        const data = {
            ...formData,
            userId: user?._id || null
        };

        try {
            const response = await addContactService(data);
            toast.success(response.data.message);

            setFormData({
                name: user?.firstName || '',
                email: user?.email || '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || 'Server error'}`);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid =
        Object.entries(formData).some(([name, value]) => !validateField(name, value)) || loading;

    const errorMessages = {
        name: {
            title: NAME_VALIDATION.title,
            details: NAME_VALIDATION.message
        },
        email: {
            title: EMAIL_VALIDATION.title,
            details: EMAIL_VALIDATION.message
        },
        subject: {
            title: SUBJECT_VALIDATION.title,
            details: SUBJECT_VALIDATION.message
        },
        message: {
            title: MESSAGE_VALIDATION.title,
            details: MESSAGE_VALIDATION.message
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="xs" className="mt-40 md:mt-10 mb-10 p-5 bg-white shadow-md rounded-lg">
                <Typography variant="h5" align="left" className="!mb-4 font-extrabold text-stone-600">
                    Contact Us
                </Typography>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {Object.entries(formData).map(([name, value]) => (
                        <div key={name} className="relative flex-grow">
                            <TextField
                                label={name.charAt(0).toUpperCase() + name.slice(1)}
                                name={name}
                                value={value}
                                onChange={handleChange}
                                onFocus={() => setFocusedField(name)}
                                onBlur={() => setFocusedField(null)}
                                multiline={name === 'message'}
                                rows={name === 'message' ? 4 : undefined}
                                inputRef={name === 'subject' ? subjectRef : null}
                                fullWidth
                                required
                                disabled={(name === 'name' || name === 'email') && user}
                                InputProps={{
                                    style: (name === 'name' || name === 'email') && user ? { cursor: 'not-allowed' } : {}
                                }}
                                variant="outlined"
                                className="mb-3"
                            />
                            <ErrorTooltip
                                field={name}
                                focusedField={focusedField}
                                isValid={validateField(name, value)}
                                value={value}
                                message={errorMessages[name]}
                            />
                        </div>
                    ))}
                    <BrownButton
                        type="submit"
                        variant="contained"
                        disabled={isFormValid || loading}
                        className="w-full"
                    >
                        <LoadingLabel loading={loading} defaultLabel="Submit" loadingLabel="Sending" />
                    </BrownButton>
                </form>
            </Container>
            <Footer />
        </>
    );
};

export default ContactUs;
