import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const AddContactModal = ({ open, onClose, onAddSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const axiosInstance = useAxios();

    const handleAddContact = async () => {
        const { name, email, subject, message } = formData;

        if (!name || !email || !subject || !message) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const response = await axiosInstance.post('/contact/create', formData);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending message');
            console.error('Error adding contact message', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Contact Message</CustomTypography>

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Message"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleAddContact}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddContactModal;