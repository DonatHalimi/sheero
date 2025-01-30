import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import { editRoleService } from '../../../services/roleService';

const EditRoleModal = ({ open, onClose, role, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);

    const validateName = (v) => /^[a-zA-Z\s]{2,10}$/.test(v);

    const isValidForm = name && isValidName;

    useEffect(() => {
        if (role) {
            setName(role.name);
        }
    }, [role]);

    const handleEditRole = async () => {
        if (!name) {
            toast.error('Please fill in the role name', { closeOnClick: true });
            return;
        }

        const updatedData = {
            name
        };

        try {
            const response = await editRoleService(role._id, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating role');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Role</CustomTypography>

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Role Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Role name must be 2-10 characters long' : ''}
                    className="!mb-4"
                />

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditRole}
                    onSecondaryClick={() => {
                        onViewDetails(role);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: !isValidForm
                    }}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditRoleModal;