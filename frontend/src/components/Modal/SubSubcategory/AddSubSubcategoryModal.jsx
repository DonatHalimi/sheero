import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const AddSubSubcategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
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
    }, []);

    const handleAddSubSubcategory = async () => {
        if (!name || !subcategory) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true
            });
            return;
        }

        try {
            await axiosInstance.post('/subsubcategories/create', {
                name,
                subcategory
            });
            toast.success('SubSubcategory added successfully');
            onAddSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding subsubcategory', error);
            toast.error('Error adding subsubcategory');
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md">
                <Typography variant='h5' className="!text-xl !font-bold !mb-2">Add SubSubcategory</Typography>
                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <OutlinedBrownFormControl fullWidth margin="normal">
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                        label='Subcategory'
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        className='!mb-6'
                    >
                        {subcategories.map((subcat) => (
                            <MenuItem key={subcat._id} value={subcat._id}>{subcat.name}</MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>
                <BrownButton
                    onClick={handleAddSubSubcategory}
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

export default AddSubSubcategoryModal;
