import { InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const EditSubSubcategoryModal = ({ open, onClose, subSubcategory, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);

    const axiosInstance = useAxios();

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
            console.error('Error updating subsubcategory', error);
            toast.error('Error updating subsubcategory');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit SubSubcategory</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
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
                <BrownButton
                    onClick={handleEditSubSubcategory}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save Changes
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditSubSubcategoryModal;
