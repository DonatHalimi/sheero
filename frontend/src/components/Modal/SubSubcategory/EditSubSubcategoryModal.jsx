import { InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const EditSubSubcategoryModal = ({ open, onClose, subSubcategory, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [subcategory, setSubcategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);

    const axiosInstance = useAxios();

    const validateName = (v) => /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{3,27}$/.test(v);

    const isValidForm = name && isValidName && subcategory;

    useEffect(() => {
        if (subSubcategory) {
            setName(subSubcategory.name);
            setSubcategory(subSubcategory.subcategory._id);
        }

        const fetchSubcategories = async () => {
            try {
                const response = await axiosInstance.get('/subcategories/get');
                setSubcategories(response.data);
            } catch (error) {
                console.error('Error fetching subcategories', error);
                toast.error('Error fetching subcategories');
            }
        };

        fetchSubcategories();
    }, [subSubcategory]);

    const handleEditSubSubcategory = async () => {
        const updatedData = {
            name,
            subcategory
        }

        try {
            const response = await axiosInstance.put(`/subsubcategories/update/${subSubcategory._id}`, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating subsubcategory');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit SubSubcategory</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    fullWidth
                    onChange={(e) => {
                        setName(e.target.value);
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-27 characters long' : ''}
                />

                <OutlinedBrownFormControl fullWidth margin="normal">
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                        label='Subcategory'
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className='mb-4'
                    >
                        {subcategories.map((subcat) => (
                            <MenuItem key={subcat._id} value={subcat._id}>{subcat.name}</MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditSubSubcategory}
                    onSecondaryClick={() => {
                        onViewDetails(subSubcategory);
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

export default EditSubSubcategoryModal;
