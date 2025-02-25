import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import { editRoleService } from '../../../services/roleService';

const EditRoleModal = ({ open, onClose, role, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [description, setDescription] = useState('');
    const [isValidDescription, setIsValidDescription] = useState(true);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[a-zA-Z\s]{2,15}$/.test(v);
    const validateDescription = (v) => /^.{5,500}$/.test(v);

    const isValidForm = name && isValidName && description && isValidDescription;

    useEffect(() => {
        if (role) {
            setName(role.name);
            setDescription(role.description);
        }
    }, [role]);

    const handleEditRole = async () => {
        setLoading(true);

        if (!name || !description) {
            toast.error('Please fill in all required fields');
            return;
        }

        const updatedData = {
            name,
            description
        };

        try {
            const response = await editRoleService(role._id, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating role');
        } finally {
            setLoading(false);
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
                    helperText={!isValidName ? 'Role name must be 2-15 characters long' : ''}
                    className="!mb-4"
                />
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Description"
                    value={description}
                    multiline
                    rows={4}
                    onChange={(e) => {
                        setDescription(e.target.value)
                        setIsValidDescription(validateDescription(e.target.value));
                    }}
                    error={!isValidDescription}
                    helperText={!isValidDescription ? 'Description must be 5-500 characters long' : ''}
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
                        disabled: !isValidForm || loading,
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditRoleModal;