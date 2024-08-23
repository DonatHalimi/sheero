import { Autocomplete, Box, Modal, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomPaper } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const AddSubSubcategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [subcategory, setSubcategory] = useState(null); // Initialize with null
    const [subcategories, setSubcategories] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await axiosInstance.get('/subcategories/get');
                const subCategoriesWithGroups = response.data.map(subCategory => ({
                    ...subCategory,
                    firstLetter: subCategory.name[0].toUpperCase()
                }));

                setSubcategories(subCategoriesWithGroups);
            } catch (error) {
                console.error('Error fetching subcategories', error);
                toast.error('Error fetching subcategories');
            }
        };

        fetchSubcategories();
    }, [axiosInstance]);

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
                subcategory: subcategory._id // Assuming subcategory has an _id field
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
                <Autocomplete
                    id="subcategory-autocomplete"
                    options={subcategories.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.name}
                    value={subcategory}
                    onChange={(event, newValue) => setSubcategory(newValue)}
                    PaperComponent={CustomPaper}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Subcategory" variant="outlined" />}
                    className='!mb-4'
                />
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
