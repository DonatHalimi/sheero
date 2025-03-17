import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddSupplierModal from '../../components/Modal/Supplier/AddSupplierModal';
import EditSupplierModal from '../../components/Modal/Supplier/EditSupplierModal';
import SupplierDetailsDrawer from '../../components/Modal/Supplier/SupplierDetailsDrawer';
import { getSuppliers } from '../../store/actions/dashboardActions';

const SupplierPage = () => {
    const { suppliers, loadingSuppliers } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSuppliers, setSelectedSuppliers] = useState([]);
    const [addSupplierOpen, setAddSupplierOpen] = useState(false);
    const [editSupplierOpen, setEditSupplierOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getSuppliers());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddSupplierOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [suppliers]);

    const handleSelectSupplier = (newSelection) => {
        setSelectedSuppliers(newSelection);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (supplier) => {
        setSelectedSupplier(supplier);
        setEditSupplierOpen(true);
    };

    const handleEditFromDrawer = (supplier) => {
        setViewDetailsOpen(false);
        setSelectedSupplier(supplier);
        setEditSupplierOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getSuppliers());
        setSelectedSuppliers([]);
    };

    const handleViewDetails = (supplier) => {
        setSelectedSupplier(supplier);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedSupplier(null);
    };

    const handleBulkDelete = () => {
        if (selectedSuppliers.length > 0) {
            setDeletionContext({
                endpoint: '/suppliers/delete-bulk',
                data: { ids: selectedSuppliers },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (supplier) => {
        setDeletionContext({
            endpoint: `/suppliers/delete/${supplier._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'contactInfo.email' },
        { label: 'Phone Number', key: 'contactInfo.phoneNumber' },
        { label: 'Actions', key: 'actions' }
    ];

    const handleExport = (data, format) => {
        const flattenedSuppliers = data.map(supplier => ({
            ...supplier,
            contactInfo: supplier.contactInfo.email + ' - ' + supplier.contactInfo.phoneNumber
        }))

        format === 'excel' ? exportToExcel(flattenedSuppliers, 'suppliers_data') : exportToJSON(data, 'suppliers_data');
    }

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingSuppliers ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Suppliers"
                            selectedItems={selectedSuppliers}
                            setAddItemOpen={setAddSupplierOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Supplier"
                            exportOptions={exportOptions(suppliers, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={suppliers}
                            selectedItems={selectedSuppliers}
                            onSelectItem={handleSelectSupplier}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddSupplierModal open={addSupplierOpen} onClose={() => setAddSupplierOpen(false)} onAddSuccess={() => dispatch(getSuppliers())} />
                <EditSupplierModal open={editSupplierOpen} onClose={() => setEditSupplierOpen(false)} supplier={selectedSupplier} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getSuppliers())} />
                <SupplierDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} supplier={selectedSupplier} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Suppliers' : 'Delete Supplier'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected suppliers?'
                        : 'Are you sure you want to delete this supplier?'
                    }
                />
            </div>
        </div>
    );
};

export default SupplierPage;