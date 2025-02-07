import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addRoleService } from '../../../services/roleService';

const AddRoleModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[a-zA-Z\s]{2,10}$/.test(v);

    const isValidForm = name && isValidName;

    const handleAddRole = async () => {
        setLoading(true);

        if (!name) {
            toast.error('Please fill in the role name');
            return;
        }

        const data = {
            name
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
                    helperText={!isValidName ? 'Role name must be 2-10 characters long' : ''}
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