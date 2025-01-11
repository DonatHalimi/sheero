import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const AddRoleModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);

    const axiosInstance = useAxios();

    const validateName = (v) => /^[a-zA-Z\s]{2,10}$/.test(v);

    const isValidForm = name && isValidName;

    const handleAddRole = async () => {
        if (!name) {
            toast.error('Please fill in the role name');
            return;
        }

        const data = {
            name
        };

        try {
            const response = await axiosInstance.post('/roles/create', data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding role');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Role</CustomTypography>

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
                <BrownButton
                    onClick={handleAddRole}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddRoleModal;