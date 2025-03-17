import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addSupplierService } from '../../../services/supplierService';
import { SupplierValidations } from '../../../utils/validations/supplier';

const AddSupplierModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const validateName = (v) => SupplierValidations.nameRules.pattern.test(v);
    const validatePhoneNumber = (v) => SupplierValidations.phoneRules.pattern.test(v);
    const validateEmail = (v) => SupplierValidations.emailRules.pattern.test(v);

    const isFormValid = name && validateName(name) && email && validateEmail(email) && phoneNumber && validatePhoneNumber(phoneNumber);

    const handleAddSupplier = async () => {
        setLoading(true);

        if (!name || !email || !phoneNumber) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            name,
            contactInfo: {
                email,
                phoneNumber,
            },
        }

        try {
            const response = await addSupplierService(data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding supplier');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Supplier</CustomTypography>

                <CustomTextField
                    label="Name"
                    value={name}
                    setValue={setName}
                    validate={validateName}
                    validationRule={SupplierValidations.nameRules}
                />

                <CustomTextField
                    label="Email"
                    value={email}
                    setValue={setEmail}
                    validate={validateEmail}
                    validationRule={SupplierValidations.emailRules}
                />

                <CustomTextField
                    label="Phone Number"
                    value={phoneNumber}
                    setValue={setPhoneNumber}
                    validate={validatePhoneNumber}
                    validationRule={SupplierValidations.phoneRules}
                />

                <BrownButton
                    onClick={handleAddSupplier}
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddSupplierModal;
