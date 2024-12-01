import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import useAxios from '../../axiosInstance';

const ContactUs = () => {
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [focusedField, setFocusedField] = useState(null);
    const [nameValid, setNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [subjectValid, setSubjectValid] = useState(true);
    const [messageValid, setMessageValid] = useState(true);

    const [loading, setLoading] = useState(false);
    const subjectRef = useRef(null);
    const axiosInstance = useAxios();

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.firstName || '',
                email: user.email || ''
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                name: '',
                email: ''
            }));
        }
    }, [user]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user) {
            subjectRef.current?.focus();
        }
    }, []);

    const validateName = (v) => /^[A-Z][\sa-zA-Z\W]{3,15}$/.test(v);
    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    const validateSubject = (v) => /^[A-Z][\sa-zA-Z\W]{5,50}$/.test(v);
    const validateMessage = (v) => /^[A-Z][\sa-zA-Z\W]{10,200}$/.test(v);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        switch (name) {
            case 'name':
                setNameValid(validateName(value));
                break;
            case 'email':
                setEmailValid(validateEmail(value));
                break;
            case 'subject':
                setSubjectValid(validateSubject(value));
                break;
            case 'message':
                setMessageValid(validateMessage(value));
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        toast.info('Sending message...', { autoClose: 1000 });

        try {
            await axiosInstance.post('/contact/create', formData);
            setLoading(false);
            toast.success('Message sent successfully!', { autoClose: 2000 });
            setFormData({
                name: user.firstName || '',
                email: user.email || '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error(`Error: ${error.response?.data?.message || 'Server error'}`, { autoClose: 3000 });
        }
    };

    const isFormValid =
        formData.name.trim() === '' || !nameValid ||
        formData.email.trim() === '' || !emailValid ||
        formData.subject.trim() === '' || !subjectValid ||
        formData.message.trim() === '' || !messageValid ||
        loading;

    return (
        <>
            <Navbar />

            <Container
                maxWidth="xs"
                className="mt-40 md:mt-10 mb-10 p-5 bg-white shadow-md rounded-lg"
            >
                <Typography variant="h5" align="left" className="!mb-4 font-extrabold text-stone-600">
                    Contact Us
                </Typography>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative flex-grow">
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            fullWidth
                            required
                            variant="outlined"
                            className="mb-3"
                        />
                        {focusedField === 'name' && !nameValid && (
                            <div className="absolute left-0 bottom-[-58px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                <span className="block text-xs font-semibold mb-1">Invalid Name</span>
                                Must start with a capital letter and be 3 to 15 characters long.
                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                            </div>
                        )}
                    </div>

                    <div className="relative flex-grow">
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            fullWidth
                            required
                            variant="outlined"
                            className="mb-3"
                        />
                        {focusedField === 'email' && !emailValid && (
                            <div className="absolute left-0 bottom-[-58px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                <span className="block text-xs font-semibold mb-1">Invalid Email</span>
                                Please provide a valid email address.
                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                            </div>
                        )}
                    </div>

                    <div className="relative flex-grow">
                        <TextField
                            label="Subject"
                            name="subject"
                            inputRef={subjectRef}
                            value={formData.subject}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('subject')}
                            onBlur={() => setFocusedField(null)}
                            fullWidth
                            required
                            variant="outlined"
                            className="mb-3"
                        />
                        {focusedField === 'subject' && !subjectValid && (
                            <div className="absolute left-0 bottom-[-58px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                <span className="block text-xs font-semibold mb-1">Invalid Subject</span>
                                Must start with a capital letter and be 5 to 50 characters long.
                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                            </div>
                        )}
                    </div>

                    <div className="relative flex-grow">
                        <TextField
                            label="Message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('message')}
                            onBlur={() => setFocusedField(null)}
                            multiline
                            rows={4}
                            fullWidth
                            required
                            variant="outlined"
                            className="mb-3"
                        />
                        {focusedField === 'message' && !messageValid && (
                            <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                <span className="block text-xs font-semibold mb-1">Invalid Message</span>
                                Must start with a capital letter and be 10 to 200 characters long.
                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                            </div>
                        )}
                    </div>
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
            </Container >

            <Footer />
        </>
    );
};

export default ContactUs;