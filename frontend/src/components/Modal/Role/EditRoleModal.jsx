import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import { editRoleService } from '../../../services/roleService';
import { RoleValidations } from '../../../utils/validations/role';

const EditRoleModal = ({ open, onClose, role, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const validateName = (v) => RoleValidations.nameRules.pattern.test(v);
    const validateDescription = (v) => RoleValidations.descriptionRules.pattern.test(v);

    const isFormValid = name && validateName(name) && description && validateDescription(description);

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

                <CustomTextField
                    label="Name"
                    value={name}
                    setValue={setName}
                    validate={validateName}
                    validationRule={RoleValidations.nameRules}
                />

                <CustomTextField
                    label="Description"
                    value={description}
                    setValue={setDescription}
                    validate={validateDescription}
                    validationRule={RoleValidations.descriptionRules}
                    multiline
                    rows={4}
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
                        disabled: !isFormValid || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditRoleModal;