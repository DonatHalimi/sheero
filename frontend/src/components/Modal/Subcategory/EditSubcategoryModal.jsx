import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownFormControl } from '../../Dashboard/CustomComponents';

const EditSubcategoryModal = ({ open, onClose, subcategory, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (subcategory) {
            setName(subcategory.name);
            setCategory(subcategory.category._id);
        }

        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories/get');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories', error);
                toast.error('Error fetching categories');
            }
        };

        fetchCategories();
    }, [subcategory]);

    const handleEditSubcategory = async () => {
        try {
            await axiosInstance.put(`/subcategories/update/${subcategory._id}`, {
                name,
                category
            });
            toast.success('Subcategory updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating subcategory', error);
            toast.error('Error updating subcategory');
        }
    };

    return (
        <Modal open={open} onClose={onClose} className='flex items-center justify-center'>
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                <Typography variant='h5' className="!text-xl !font-bold !mb-6">Edit Subcategory</Typography>
                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                />
                <OutlinedBrownFormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                        label='Category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='mb-4'
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>
                <BrownButton
                    onClick={handleEditSubcategory}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save Changes
                </BrownButton>
            </Box>
        </Modal>
    );
};

export default EditSubcategoryModal;