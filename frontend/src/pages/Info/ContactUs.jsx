import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ErrorTooltip } from '../../assets/CustomComponents';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import useAxios from '../../utils/axiosInstance';

const ContactUs = () => {
    const { user } = useSelector((state) => state.auth);
    const axiosInstance = useAxios();

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
        window.scrollTo(0, 0);
        user && subjectRef.current?.focus();
    }, [user]);

    const validateField = (name, value) => {
        const rules = {
            name: /^[A-Z][\sa-zA-Z\W]{3,15}$/,
            email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            subject: /^[\sa-zA-Z0-9\W]{5,50}$/,
            message: /^[\sa-zA-Z\W]{10,200}$/
        };
        return rules[name]?.test(value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.info('Sending message...', { autoClose: 500 });

        try {
            await axiosInstance.post('/contact/create', {
                ...formData,
                userId: user?._id || null
            });
            setLoading(false);
            toast.success('Message sent successfully!', { autoClose: 2000 });
            setFormData({
                name: user?.firstName || '',
                email: user?.email || '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || 'Server error'}`, { autoClose: 3000 });
        }
    };

    const isFormValid =
        Object.entries(formData).some(([name, value]) => !validateField(name, value)) || loading;

    const errorMessages = {
        name: {
            title: 'Invalid Name',
            details: 'Must start with a capital letter and be 3 to 15 characters long.'
        },
        email: {
            title: 'Invalid Email',
            details: 'Please provide a valid email address.'
        },
        subject: {
            title: 'Invalid Subject',
            details: 'Must start with a capital letter and be 5 to 50 characters long.'
        },
        message: {
            title: 'Invalid Message',
            details: 'Must start with a capital letter and be 10 to 200 characters long.'
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
                    <Box textAlign="left">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isFormValid}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            {loading ? 'Sending...' : 'Submit'}
                        </Button>
                    </Box>
                </form>
            </Container>
            <Footer />
        </>
    );
};

export default ContactUs;
