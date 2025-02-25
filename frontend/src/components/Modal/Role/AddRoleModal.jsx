import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addRoleService } from '../../../services/roleService';

const AddRoleModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [description, setDescription] = useState('');
    const [isValidDescription, setIsValidDescription] = useState(true);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[a-zA-Z\s]{2,15}$/.test(v);
    const validateDescription = (v) => /^.{5,500}$/.test(v);

    const isValidForm = name && isValidName && description && isValidDescription;

    const handleAddRole = async () => {
        setLoading(true);

        if (!name || !description) {
            toast.error('Please fill in all required fields');
            return;
        }

        const data = {
            name,
            description
        };

        try {
            const response = await addRoleService(data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Role</CustomTypography>

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
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
                <BrownButton
                    onClick={handleAddRole}
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

export default AddRoleModal;