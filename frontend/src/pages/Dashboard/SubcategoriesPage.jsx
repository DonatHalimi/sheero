import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddSubcategoryModal from '../../components/Modal/Subcategory/AddSubcategoryModal';
import DeleteSubcategoryModal from '../../components/Modal/Subcategory/DeleteSubcategoryModal';
import EditSubcategoryModal from '../../components/Modal/Subcategory/EditSubcategoryModal';
import { AuthContext } from '../../context/AuthContext';

const SubcategoriesPage = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [addSubcategoryOpen, setAddSubcategoryOpen] = useState(false);
    const [editSubcategoryOpen, setEditSubcategoryOpen] = useState(false);
    const [deleteSubcategoryOpen, setDeleteSubcategoryOpen] = useState(false);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await axiosInstance.get('/subcategories/get');
                setSubcategories(response.data);
            } catch (error) {
                toast.error('Error fetching subcategories');
                console.error('Error fetching subcategories', error);
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories/get');
                setCategories(response.data);
            } catch (error) {
                toast.error('Error fetching subcategories');
                console.error('Error fetching subcategories', error);
            }
        };

        fetchCategories();

        fetchSubcategories();
    }, [addSubcategoryOpen, editSubcategoryOpen, deleteSubcategoryOpen, axiosInstance]);

    const refreshSubcategories = async () => {
        try {
            const response = await axiosInstance.get('/subcategories/get');
            const categories = await axiosInstance.get('/categories/get')
            setSubcategories(response.data);
            setCategories(categories.data)
        } catch (error) {
            console.error('Error fetching subcategory', error);
        }
    };

    const handleSelectSubcategory = (subcategoryId) => {
        setSelectedSubcategories((prevSelected) => {
            if (prevSelected.includes(subcategoryId)) {
                return prevSelected.filter(id => id !== subcategoryId);
            } else {
                return [...prevSelected, subcategoryId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSubcategories(subcategories.map(subcategory => subcategory._id));
        } else {
            setSelectedSubcategories([]);
        }
    };

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>Subcategories</Typography>
                        <div>
                            <OutlinedBrownButton onClick={() => setAddSubcategoryOpen(true)} className='!mr-4'>Add Subcategory</OutlinedBrownButton>
                            {selectedSubcategories.length > 0 && (
                                <OutlinedBrownButton
                                    onClick={() => setDeleteSubcategoryOpen(true)}
                                    disabled={selectedSubcategories.length === 0}
                                >
                                    {selectedSubcategories.length > 1 ? 'Delete Selected Subcategories' : 'Delete Subcategory'}
                                </OutlinedBrownButton>
                            )}
                        </div>
                    </div>
                    <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <BoldTableCell>
                                        <Checkbox
                                            checked={selectedSubcategories.length === subcategories.length}
                                            onChange={handleSelectAll}
                                        />
                                    </BoldTableCell>
                                    <BoldTableCell>Name</BoldTableCell>
                                    <BoldTableCell>Category</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subcategories.map((subcategory) => (
                                    <TableRow key={subcategory._id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedSubcategories.includes(subcategory._id)}
                                                onChange={() => handleSelectSubcategory(subcategory._id)}
                                            />
                                        </TableCell>
                                        <TableCell>{subcategory.name}</TableCell>
                                        <TableCell>{subcategory.category.name}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedSubcategory(subcategory); setEditSubcategoryOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <AddSubcategoryModal open={addSubcategoryOpen} onClose={() => setAddSubcategoryOpen(false)} onAddSuccess={refreshSubcategories} />
                    <EditSubcategoryModal open={editSubcategoryOpen} onClose={() => setEditSubcategoryOpen(false)} subcategory={selectedSubcategory} onEditSuccess={refreshSubcategories} />
                    <DeleteSubcategoryModal open={deleteSubcategoryOpen} onClose={() => setDeleteSubcategoryOpen(false)} subcategories={selectedSubcategories.map(id => subcategories.find(subcategory => subcategory._id === id))} onDeleteSuccess={refreshSubcategories} />
                </div>
            </div>
        </>
    );
};

export default SubcategoriesPage;
