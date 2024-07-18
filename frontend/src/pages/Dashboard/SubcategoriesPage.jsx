import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, BrownDeleteOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddSubcategoryModal from '../../components/Modal/Subcategory/AddSubcategoryModal';
import DeleteSubcategoryModal from '../../components/Modal/Subcategory/DeleteSubcategoryModal';
import EditSubcategoryModal from '../../components/Modal/Subcategory/EditSubcategoryModal';
import { AuthContext } from '../../context/AuthContext';

const SubcategoriesPage = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
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
            console.error('Error fetching products', error);
        }
    };

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>Subcategories</Typography>
                        <OutlinedBrownButton onClick={() => setAddSubcategoryOpen(true)}>Add Subcategory</OutlinedBrownButton>
                    </div>
                    <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <BoldTableCell>Name</BoldTableCell>
                                    <BoldTableCell>Category</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subcategories.map((subcategory) => (
                                    <TableRow key={subcategory._id}>
                                        <TableCell>{subcategory.name}</TableCell>
                                        <TableCell>{subcategory.category.name}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedSubcategory(subcategory); setEditSubcategoryOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            <ActionButton onClick={() => { setSelectedSubcategory(subcategory); setDeleteSubcategoryOpen(true); }}><BrownDeleteOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <AddSubcategoryModal open={addSubcategoryOpen} onClose={() => setAddSubcategoryOpen(false)} onAddSuccess={refreshSubcategories} />
                    <EditSubcategoryModal open={editSubcategoryOpen} onClose={() => setEditSubcategoryOpen(false)} subcategory={selectedSubcategory} onEditSuccess={refreshSubcategories} />
                    <DeleteSubcategoryModal open={deleteSubcategoryOpen} onClose={() => setDeleteSubcategoryOpen(false)} subcategory={selectedSubcategory} onDeleteSuccess={refreshSubcategories} />
                </div>
            </div>
        </>
    );
};

export default SubcategoriesPage;
