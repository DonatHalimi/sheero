import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const EditSubSubcategoryModal = ({ open, onClose, subSubcategory, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [subcategories, setSubcategories] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

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
        try {
            await axiosInstance.put(`/subsubcategories/update/${subSubcategory._id}`, {
                name,
                subcategory
            });
            toast.success('SubSubcategory updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating subsubcategory', error);
            toast.error('Error updating subsubcategory');
        }
    };

    return (
        <Modal open={open} onClose={onClose} className='flex items-center justify-center'>
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                <Typography variant='h5' className="!text-xl !font-bold !mb-4">Edit SubSubcategory</Typography>
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
            </Box>
        </Modal>
    );
};

export default EditSubSubcategoryModal;
