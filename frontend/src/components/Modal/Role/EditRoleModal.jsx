import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const EditRoleModal = ({ open, onClose, role, onEditSuccess }) => {
    const [name, setName] = useState('');

    const axiosInstance = useAxios();

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
            if (error.response && error.response.status === 403) {
                toast.error('You do not have permission to perform this action');
            } else {
                toast.error('Error updating role');
            }
            console.error('Error updating role', error);
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
                    onChange={(e) => setName(e.target.value)}
                    className="!mb-4"
                />

                <BrownButton
                    onClick={handleEditRole}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditRoleModal;