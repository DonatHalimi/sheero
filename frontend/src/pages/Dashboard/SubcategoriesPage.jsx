import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, DashboardImage, exportOptions, formatDate, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import AddSubcategoryModal from '../../components/Modal/Subcategory/AddSubcategoryModal';
import EditSubcategoryModal from '../../components/Modal/Subcategory/EditSubcategoryModal';
import SubcategoryDetailsDrawer from '../../components/Modal/Subcategory/SubcategoryDetailsDrawer';
import { getSubcategories } from '../../store/actions/dashboardActions';

const SubcategoriesPage = () => {
    const { subcategories, loadingSubcategories } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [addSubcategoryOpen, setAddSubcategoryOpen] = useState(false);
    const [editSubcategoryOpen, setEditSubcategoryOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getSubcategories());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddSubcategoryOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [subcategories]);

    const handleSelectSubcategory = (newSelection) => {
        setSelectedSubcategories(newSelection);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedSubcategory(imageUrl);
        setImagePreviewOpen(true);
    };

    const handleEdit = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setEditSubcategoryOpen(true);
    };

    const handleEditFromDrawer = (subcategory) => {
        setViewDetailsOpen(false);
        setSelectedSubcategory(subcategory);
        setEditSubcategoryOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getSubcategories());
        setSelectedSubcategories([]);
    };

    const handleViewDetails = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedSubcategory(null);
    };

    const handleBulkDelete = () => {
        if (selectedSubcategories.length > 0) {
            setDeletionContext({
                endpoint: '/subcategories/delete-bulk',
                data: { ids: selectedSubcategories },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (subcategory) => {
        setDeletionContext({
            endpoint: `/subcategories/delete/${subcategory._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { label: 'Name', key: 'name' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => <DashboardImage item={item} handleImageClick={handleImageClick} />
        },
        { label: 'Category', key: 'category.name' },
        { key: 'createdAt', label: 'Created At', render: (item) => formatDate(item.createdAt) },
        { key: 'updatedAt', label: 'Updated At', render: (item) => formatDate(item.updatedAt) },
        { label: 'Actions', key: 'actions' }
    ];

    const handleExport = (data, format) => {
        const flattenedSubcategories = data.map(subcategory => ({
            ...subcategory,
            category: subcategory.category ? subcategory.category.name : 'N/A'
        }))

        format === 'excel' ? exportToExcel(flattenedSubcategories, 'subcategories_data') : exportToJSON(data, 'subcategories_data');
    }

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                {loadingSubcategories ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Subcategories"
                            selectedItems={selectedSubcategories}
                            setAddItemOpen={setAddSubcategoryOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Subcategory"
                            exportOptions={exportOptions(subcategories, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={subcategories}
                            selectedItems={selectedSubcategories}
                            onSelectItem={handleSelectSubcategory}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddSubcategoryModal open={addSubcategoryOpen} onClose={() => setAddSubcategoryOpen(false)} onAddSuccess={() => dispatch(getSubcategories())} />
                <EditSubcategoryModal open={editSubcategoryOpen} onClose={() => setEditSubcategoryOpen(false)} subcategory={selectedSubcategory} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getSubcategories())} />
                <SubcategoryDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} subcategory={selectedSubcategory} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Subcategories' : 'Delete Subcategory'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected subcategories?'
                        : 'Are you sure you want to delete this subcategory?'
                    }
                />
                <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedSubcategory} />
            </div>
        </div>
    );
};

export default SubcategoriesPage;