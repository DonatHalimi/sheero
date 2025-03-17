import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addRoleService } from '../../../services/roleService';
import { RoleValidations } from '../../../utils/validations/role';

const AddRoleModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const validateName = (v) => RoleValidations.nameRules.pattern.test(v);
    const validateDescription = (v) => RoleValidations.descriptionRules.pattern.test(v);

    const isFormValid = name && validateName(name) && description && validateDescription(description);

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

                <BrownButton
                    onClick={handleAddRole}
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

export default AddRoleModal;