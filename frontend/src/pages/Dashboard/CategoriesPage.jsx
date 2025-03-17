import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, DashboardImage, exportOptions, formatDate, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddCategoryModal from '../../components/Modal/Category/AddCategoryModal';
import CategoryDetailsDrawer from '../../components/Modal/Category/CategoryDetailsDrawer';
import EditCategoryModal from '../../components/Modal/Category/EditCategoryModal';
import DeleteModal from '../../components/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import { getCategories } from '../../store/actions/categoryActions';

const CategoriesPage = () => {
    const { categories, loadingCategories } = useSelector((state) => state.categories);
    const dispatch = useDispatch();

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const [editCategoryOpen, setEditCategoryOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddCategoryOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [categories]);

    const handleSelectCategory = (newSelection) => {
        setSelectedCategories(newSelection);
    }

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedCategory(imageUrl);
        setImagePreviewOpen(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setEditCategoryOpen(true);
    };

    const handleEditFromDrawer = (category) => {
        setViewDetailsOpen(false);
        setSelectedCategory(category);
        setEditCategoryOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getCategories());
        setSelectedCategories([]);
    };

    const handleViewDetails = (category) => {
        setSelectedCategory(category);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedCategory(null);
    };

    const handleBulkDelete = () => {
        if (selectedCategories.length > 0) {
            setDeletionContext({
                endpoint: '/categories/delete-bulk',
                data: { ids: selectedCategories },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (category) => {
        setDeletionContext({
            endpoint: `/categories/delete/${category._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => <DashboardImage item={item} handleImageClick={handleImageClick} />
        },
        { key: 'createdAt', label: 'Created At', render: (item) => formatDate(item.createdAt) },
        { key: 'updatedAt', label: 'Updated At', render: (item) => formatDate(item.updatedAt) },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        format === 'excel' ? exportToExcel(data, 'categories_data') : exportToJSON(data, 'categories_data');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingCategories ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Categories"
                            selectedItems={selectedCategories}
                            setAddItemOpen={setAddCategoryOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Category"
                            exportOptions={exportOptions(categories, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={categories}
                            selectedItems={selectedCategories}
                            onSelectItem={handleSelectCategory}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddCategoryModal open={addCategoryOpen} onClose={() => setAddCategoryOpen(false)} onAddSuccess={() => dispatch(getCategories())} />
                <EditCategoryModal open={editCategoryOpen} onClose={() => setEditCategoryOpen(false)} category={selectedCategory} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getCategories())} />
                <CategoryDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} category={selectedCategory} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Categories' : 'Delete Category'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected categories?'
                        : 'Are you sure you want to delete this category?'
                    }
                />
                <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedCategory} />
            </div>
        </div>
    );
};

export default CategoriesPage;