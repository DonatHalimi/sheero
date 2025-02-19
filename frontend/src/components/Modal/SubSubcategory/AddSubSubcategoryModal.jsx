import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomPaper, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { getSubcategoriesService } from '../../../services/subcategoryService';
import { addSubSubcategoryService } from '../../../services/subSubcategoryService';

const AddSubSubcategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [subcategory, setSubcategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{3,27}$/.test(v);

    const isValidForm = name && isValidName && subcategory;

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await getSubcategoriesService();
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
    }, []);

    const handleAddSubSubcategory = async () => {
        setLoading(true);

        if (!name || !subcategory) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            name,
            subcategory: subcategory._id
        }

        try {
            const response = await addSubSubcategoryService(data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating subsubcategory');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add SubSubcategory</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    fullWidth
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsValidName(validateName(e.target.value))
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-27 characters long' : ''}
                    className='!mb-4'
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
                    disabled={!isValidForm || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddSubSubcategoryModal;
