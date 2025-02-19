import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, knownEmailProviders } from '../../../assets/CustomComponents';
import { editSupplierService } from '../../../services/supplierService';

const EditSupplierModal = ({ open, onClose, supplier, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{2,15}$/.test(v);
    const validatePhoneNumber = (v) => /^0(44|45|48|49)\d{6}$/.test(v);
    const validateEmail = (v) => new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i').test(v);

    const isValidForm = name && isValidName && email && isValidEmail && phoneNumber && isValidPhoneNumber;

    useEffect(() => {
        if (supplier) {
            setName(supplier.name);
            if (supplier.contactInfo) {
                setEmail(supplier.contactInfo.email)
                setPhoneNumber(supplier.contactInfo.phoneNumber)
            }
        }

    }, [supplier]);

    const handleEditSupplier = async () => {
        setLoading(true);

        const updatedData = {
            name,
            contactInfo: {
                email,
                phoneNumber,
            },
        }

        try {
            const response = await editSupplierService(supplier._id, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating supplier');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Supplier</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    fullWidth
                    onChange={(e) => {
                        setName(e.target.value);
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? "Name must start with a capital letter and be 2-15 characters long" : ""}
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Email"
                    value={email}
                    fullWidth
                    type='email'
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setIsValidEmail(validateEmail(e.target.value));
                    }}
                    error={!isValidEmail}
                    helperText={!isValidEmail ? "Please enter a valid email address" : ""}
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Phone Number"
                    value={phoneNumber}
                    fullWidth
                    placeholder="044/45/48 XXXXXX"
                    onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setIsValidPhoneNumber(validatePhoneNumber(e.target.value));
                    }}
                    error={!isValidPhoneNumber}
                    helperText={!isValidPhoneNumber ? "Phone number must start with 044, 045, 048 or 049 followed by 6 digits" : ""}
                    className='!mb-4'
                />

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditSupplier}
                    onSecondaryClick={() => {
                        onViewDetails(supplier);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: !isValidForm || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditSupplierModal;