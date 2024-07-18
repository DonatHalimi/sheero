import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, BrownDeleteOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddCategoryModal from '../../components/Modal/Category/AddCategoryModal';
import DeleteCategoryModal from '../../components/Modal/Category/DeleteCategoryModal';
import EditCategoryModal from '../../components/Modal/Category/EditCategoryModal';
import { AuthContext } from '../../context/AuthContext';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const [editCategoryOpen, setEditCategoryOpen] = useState(false);
    const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories/get');
                setCategories(response.data);
            } catch (error) {
                toast.error('Error fetching categories');
                console.error('Error fetching categories', error);
            }
        };

        fetchCategories();
    }, [addCategoryOpen, editCategoryOpen, deleteCategoryOpen, axiosInstance]);

    const refreshCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories/get');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    return (
        <>
            <div className='flex flex-col items-center justify-center p-4 mt-24'>
                <div className='flex items-center justify-between w-full mb-4 px-14'>
                    <Typography variant='h5'>Categories</Typography>
                    <OutlinedBrownButton onClick={() => setAddCategoryOpen(true)}>Add Category</OutlinedBrownButton>
                </div>
                <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <BoldTableCell>Name</BoldTableCell>
                                <BoldTableCell>Image</BoldTableCell>
                                <BoldTableCell>Actions</BoldTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category._id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell><img className='rounded-md' src={`http://localhost:5000/${category.image}`} alt="" width={80} /></TableCell>
                                    <TableCell>
                                        <ActionButton onClick={() => { setSelectedCategory(category); setEditCategoryOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                        <ActionButton onClick={() => { setSelectedCategory(category); setDeleteCategoryOpen(true); }}><BrownDeleteOutlinedIcon /></ActionButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <AddCategoryModal open={addCategoryOpen} onClose={() => setAddCategoryOpen(false)} onAddSuccess={refreshCategories} />
                <EditCategoryModal open={editCategoryOpen} onClose={() => setEditCategoryOpen(false)} category={selectedCategory} onEditSuccess={refreshCategories} />
                <DeleteCategoryModal open={deleteCategoryOpen} onClose={() => setDeleteCategoryOpen(false)} category={selectedCategory} onDeleteSuccess={refreshCategories} />
            </div>
        </>
    );
};

export default CategoriesPage;