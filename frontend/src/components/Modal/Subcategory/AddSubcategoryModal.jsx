import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownFormControl } from '../../Dashboard/CustomComponents';

const AddSubcategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
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
    }, []);

    const handleAddSubcategory = async () => {
        if (!name || !category) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true
            })
            return;
        }

        try {
            await axiosInstance.post('/subcategories/create', {
                name,
                category
            });
            toast.success('Subcategory added successfully');
            onAddSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding subcategory', error);
            toast.error('Error adding subcategory');
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md">
                <Typography variant='h5' className="!text-xl !font-bold !mb-2">Add Subcategory</Typography>
                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <OutlinedBrownFormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                        label='Category'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='!mb-6'
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>
                <BrownButton
                    onClick={handleAddSubcategory}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add
                </BrownButton>
            </Box>
        </Modal>
    );
};

export default AddSubcategoryModal;