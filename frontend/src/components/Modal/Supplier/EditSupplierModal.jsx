import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import { editSupplierService } from '../../../services/supplierService';
import { SupplierValidations } from '../../../utils/validations/supplier';

const EditSupplierModal = ({ open, onClose, supplier, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const validateName = (v) => SupplierValidations.nameRules.pattern.test(v);
    const validatePhoneNumber = (v) => SupplierValidations.phoneRules.pattern.test(v);
    const validateEmail = (v) => SupplierValidations.emailRules.pattern.test(v);

    const isFormValid = name && validateName(name) && email && validateEmail(email) && phoneNumber && validatePhoneNumber(phoneNumber);

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

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditSupplier}
                    onSecondaryClick={() => {
                        onViewDetails(supplier);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: !isFormValid || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditSupplierModal;