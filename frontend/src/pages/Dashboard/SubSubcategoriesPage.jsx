import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, formatDate, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddSubSubcategoryModal from '../../components/Modal/SubSubcategory/AddSubSubcategoryModal';
import EditSubSubcategoryModal from '../../components/Modal/SubSubcategory/EditSubSubcategoryModal';
import SubSubcategoryDetailsDrawer from '../../components/Modal/SubSubcategory/SubSubcategoryDetailsDrawer';
import { getSubSubcategories } from '../../store/actions/dashboardActions';

const SubSubcategoriesPage = () => {
    const { subSubcategories, loadingSubSubcategories } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedSubSubcategory, setSelectedSubSubcategory] = useState(null);
    const [selectedSubSubcategories, setSelectedSubSubcategories] = useState([]);
    const [addSubSubcategoryOpen, setAddSubSubcategoryOpen] = useState(false);
    const [editSubSubcategoryOpen, setEditSubSubcategoryOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getSubSubcategories());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddSubSubcategoryOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [subSubcategories]);

    const handleSelectSubSubcategory = (newSelection) => {
        setSelectedSubSubcategories(newSelection);    
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (subSubcategory) => {
        setSelectedSubSubcategory(subSubcategory);
        setEditSubSubcategoryOpen(true);
    };

    const handleEditFromDrawer = (subSubcategory) => {
        setViewDetailsOpen(false);
        setSelectedSubSubcategory(subSubcategory);
        setEditSubSubcategoryOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getSubSubcategories());
        setSelectedSubSubcategories([]);
    };

    const handleViewDetails = (subSubcategory) => {
        setSelectedSubSubcategory(subSubcategory);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedSubSubcategory(null);
    };

    const handleBulkDelete = () => {
        if (selectedSubSubcategories.length > 0) {
            setDeletionContext({
                endpoint: '/subsubcategories/delete-bulk',
                data: { ids: selectedSubSubcategories },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (subSubcategory) => {
        setDeletionContext({
            endpoint: `/subsubcategories/delete/${subSubcategory._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { label: 'Name', key: 'name' },
        { label: 'Subcategory', key: 'subcategory.name' },
        { key: 'createdAt', label: 'Created At', render: (item) => formatDate(item.createdAt) },
        { key: 'updatedAt', label: 'Updated At', render: (item) => formatDate(item.updatedAt) },
        { label: 'Actions', key: 'actions' }
    ];

    const handleExport = (data, format) => {
        const flattenedSubSubcategories = data.map(subSubcategory => ({
            ...subSubcategory,
            subcategory: subSubcategory.subcategory ? subSubcategory.subcategory.name : 'N/A',
        }));

        format === 'excel' ? exportToExcel(flattenedSubSubcategories, 'subSubcategories_data') : exportToJSON(data, 'subSubcategories_data');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingSubSubcategories ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="SubSubcategories"
                            selectedItems={selectedSubSubcategories}
                            setAddItemOpen={setAddSubSubcategoryOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="SubSubcategory"
                            exportOptions={exportOptions(subSubcategories, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={subSubcategories}
                            selectedItems={selectedSubSubcategories}
                            onSelectItem={handleSelectSubSubcategory}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddSubSubcategoryModal open={addSubSubcategoryOpen} onClose={() => setAddSubSubcategoryOpen(false)} onAddSuccess={() => dispatch(getSubSubcategories())} />
                <EditSubSubcategoryModal open={editSubSubcategoryOpen} onClose={() => setEditSubSubcategoryOpen(false)} subSubcategory={selectedSubSubcategory} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getSubSubcategories())} />
                <SubSubcategoryDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} subSubcategory={selectedSubSubcategory} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete SubSubcategories' : 'Delete SubSubcategory'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected subsubcategories?'
                        : 'Are you sure you want to delete this subsubcategory?'
                    }
                />
            </div>
        </div>
    );
};

export default SubSubcategoriesPage;