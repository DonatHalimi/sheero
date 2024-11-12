import { Box, Button, Container, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../axiosInstance';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { AuthContext } from '../../context/AuthContext';

const ContactUs = () => {
    const { auth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const subjectRef = useRef(null);
    const axiosInstance = useAxios();

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            name: auth.firstName || '',
            email: auth.email || ''
        }));
    }, [auth.firstName, auth.email]);

    useEffect(() => {
        window.scrollTo(0, 0);
        subjectRef.current?.focus();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.info('Sending message...', { autoClose: 1000 });

        try {
            await axiosInstance.post('/contact/create', formData);
            setLoading(false);
            toast.success('Message sent successfully!', { autoClose: 2000 });
            setFormData({
                name: auth.firstName || '',
                email: auth.email || '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setLoading(false);
            toast.error(`Error: ${error.response?.data?.message || 'Server error'}`, { autoClose: 3000 });
        }
    };

    return (
        <>
            <Navbar />

            <Container
                maxWidth="xs"
                className="mt-40 md:mt-10 mb-10 p-5 bg-white shadow-md rounded-lg"
            >
                <p className="text-3xl mb-4 text-left">
                    Contact Us
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        className="mb-3"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        className="mb-3"
                    />
                    <TextField
                        label="Subject"
                        name="subject"
                        inputRef={subjectRef}
                        value={formData.subject}
                        onChange={handleChange}
                        fullWidth
                        required
                        variant="outlined"
                        className="mb-3"
                    />
                    <TextField
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        required
                        variant="outlined"
                        className="mb-3"
                    />
                    <Box textAlign="left">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
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