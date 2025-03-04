import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, knownEmailProviders, LoadingLabel } from '../../../assets/CustomComponents';
import { addContactService } from '../../../services/contactService';

const AddContactModal = ({ open, onClose, onAddSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const { user } = useSelector((state) => state.auth);

    const [isValidName, setIsValidName] = useState(true);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidSubject, setIsValidSubject] = useState(true);
    const [isValidMessage, setIsValidMessage] = useState(true);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][a-zA-ZëËçÇ\s]{3,15}$/.test(v);
    const validateEmail = (v) => new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i').test(v);
    const validateSubject = (v) => /^[A-Z][\sa-zA-Z\W]{5,50}$/.test(v);
    const validateMessage = (v) => /^[A-Z][\sa-zA-Z\W]{10,200}$/.test(v);

    const isValidForm =
        formData.name &&
        formData.email &&
        formData.subject &&
        formData.message &&
        isValidName &&
        isValidEmail &&
        isValidSubject &&
        isValidMessage;

    useEffect(() => {
        if (user) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                name: user.firstName || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleAddContact = async () => {
        setLoading(true);

        const { name, email, subject, message } = formData;

        if (!name || !email || !subject || !message) {
            toast.error('Please fill in all fields');
            return;
        }

        const data = {
            name,
            email,
            subject,
            message
        };

        try {
            const response = await addContactService(data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding contact');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'name') setIsValidName(validateName(value));
        if (name === 'email') setIsValidEmail(validateEmail(value));
        if (name === 'subject') setIsValidSubject(validateSubject(value));
        if (name === 'message') setIsValidMessage(validateMessage(value));
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
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-15 characters long' : ''}
                    className="!mb-4"
                />
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!isValidEmail}
                    helperText={!isValidEmail ? 'Please provide a valid email address' : ''}
                    className="!mb-4"
                />
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!isValidSubject}
                    helperText={!isValidSubject ? 'Subject must start with a capital letter and be 5-50 characters long' : ''}
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
                    error={!isValidMessage}
                    helperText={!isValidMessage ? 'Message must start with a capital letter and be 10-200 characters long' : ''}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleAddContact}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddContactModal;