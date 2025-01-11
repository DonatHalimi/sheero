import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const EditRoleModal = ({ open, onClose, role, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);

    const axiosInstance = useAxios();

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
            const response = await axiosInstance.put(`/roles/update/${role._id}`, updatedData);
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

                <BrownButton
                    onClick={handleEditRole}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Save
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditRoleModal;