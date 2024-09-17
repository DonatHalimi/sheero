import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        toast.info('Sending message...', { autoClose: 1000 });

        try {
            const response = await axios.post('http://localhost:5000/api/contact/create', formData);
            setLoading(false);
            toast.success('Message sent successfully!', { autoClose: 2000 });
            // Reset form data after successful submission
            setFormData({
                name: '',
                email: '',
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
                maxWidth="xs"  // Reduced the width to make the form narrower
                className="my-10 p-5 bg-white shadow-md rounded-lg"
            >
                <p  className="text-3xl mb-4 text-left">  {/* Align text to the left */}
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
                    <Box textAlign="left">  {/* Align the button to the left */}
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
