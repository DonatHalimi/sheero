import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
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
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchCategories();
    }, [addCategoryOpen, editCategoryOpen, deleteCategoryOpen, axiosInstance]);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories/get');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleSelectCategory = (categoryId) => {
        const id = Array.isArray(categoryId) ? categoryId[0] : categoryId;

        setSelectedCategories((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedCategories(e.target.checked ? categories.map(category => category._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'image', label: 'Image', render: (item) => <img className='rounded-md' src={`http://localhost:5000/${item.image}`} alt={item.name} width={80} /> },
        { key: 'actions', label: 'Actions' }
    ];

    const renderActionButtons = (category) => (
        <ActionButton onClick={() => { setSelectedCategory(category); setEditCategoryOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>Categories</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddCategoryOpen(true)} className='!mr-4'>
                    Add Category
                </OutlinedBrownButton>
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
    );

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardTable
                    columns={columns}
                    data={categories}
                    selectedItems={selectedCategories}
                    onSelectItem={handleSelectCategory}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                />

                <AddCategoryModal open={addCategoryOpen} onClose={() => setAddCategoryOpen(false)} onAddSuccess={fetchCategories} />
                <EditCategoryModal open={editCategoryOpen} onClose={() => setEditCategoryOpen(false)} category={selectedCategory} onEditSuccess={fetchCategories} />
                <DeleteCategoryModal open={deleteCategoryOpen} onClose={() => setDeleteCategoryOpen(false)} categories={selectedCategories.map(id => categories.find(category => category._id === id))} onDeleteSuccess={fetchCategories} />
            </div>
        </div>
    );
};

export default CategoriesPage;
