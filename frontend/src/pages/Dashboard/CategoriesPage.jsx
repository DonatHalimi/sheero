import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddCategoryModal from '../../components/Modal/Category/AddCategoryModal';
import DeleteCategoryModal from '../../components/Modal/Category/DeleteCategoryModal';
import EditCategoryModal from '../../components/Modal/Category/EditCategoryModal';
import { AuthContext } from '../../context/AuthContext';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const [editCategoryOpen, setEditCategoryOpen] = useState(false);
    const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
    const [fetchErrorCount, setFetchErrorCount] = useState(0);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories/get');
                setCategories(response.data);
                setFetchErrorCount(0);
            } catch (error) {
                setFetchErrorCount(prevCount => {
                    if (prevCount < 5) {
                        toast.error('Error fetching categories');
                    }
                    return prevCount + 1;
                });
                console.error('Error fetching categories', error);
            }
        };

        fetchCategories();
    }, [addCategoryOpen, editCategoryOpen, deleteCategoryOpen, axiosInstance]);

    const refreshCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories/get');
            setCategories(response.data);
            setFetchErrorCount(0);
        } catch (error) {
            setFetchErrorCount(prevCount => {
                if (prevCount < 5) {
                    toast.error('Error fetching categories');
                }
                return prevCount + 1;
            });
            console.error('Error fetching categories', error);
        }
    };

    const handleSelectCategory = (categoryId) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter(id => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCategories(categories.map(category => category._id));
        } else {
            setSelectedCategories([]);
        }
    };

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>Categories</Typography>
                        <div>
                            <OutlinedBrownButton onClick={() => setAddCategoryOpen(true)} className='!mr-4'>Add Category</OutlinedBrownButton>
                            {selectedCategories.length > 0 && (
                                <OutlinedBrownButton
                                    onClick={() => setDeleteCategoryOpen(true)}
                                    disabled={selectedCategories.length === 0}
                                >
                                    {selectedCategories.length > 1 ? 'Delete Selected Categories' : 'Delete Category'}
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
                                            checked={selectedCategories.length === categories.length}
                                            onChange={handleSelectAll}
                                            indeterminate={selectedCategories.length > 0 && selectedCategories.length < categories.length}
                                        />
                                    </BoldTableCell>
                                    <BoldTableCell>Name</BoldTableCell>
                                    <BoldTableCell>Image</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <TableRow key={category._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedCategories.includes(category._id)}
                                                    onChange={() => handleSelectCategory(category._id)}
                                                />
                                            </TableCell>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>
                                                <img className='rounded-md' src={`http://localhost:5000/${category.image}`} alt="" width={80} />
                                            </TableCell>
                                            <TableCell>
                                                <ActionButton onClick={() => { setSelectedCategory(category); setEditCategoryOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No categories found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <AddCategoryModal open={addCategoryOpen} onClose={() => setAddCategoryOpen(false)} onAddSuccess={refreshCategories} />
                    <EditCategoryModal open={editCategoryOpen} onClose={() => setEditCategoryOpen(false)} category={selectedCategory} onEditSuccess={refreshCategories} />
                    <DeleteCategoryModal open={deleteCategoryOpen} onClose={() => setDeleteCategoryOpen(false)} categories={selectedCategories.map(id => categories.find(category => category._id === id))} onDeleteSuccess={refreshCategories} />
                </div>
            </div>
        </>
    );
};

export default CategoriesPage;