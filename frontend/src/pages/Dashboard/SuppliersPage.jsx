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
    const [deleteSupplierOpen, setDeleteSupplierOpen] = useState(false);
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

    const handleSelectSupplier = (supplierId) => {
        const id = Array.isArray(supplierId) ? supplierId[0] : supplierId;

        setSelectedSuppliers((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSuppliers(suppliers.map(supplier => supplier._id));
        } else {
            setSelectedSuppliers([]);
        }
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

    const getSelectedSuppliers = () => {
        return selectedSuppliers
            .map((id) => suppliers.find((supplier) => supplier._id === id))
            .filter((supplier) => supplier);
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
                            setDeleteItemOpen={setDeleteSupplierOpen}
                            itemName="Supplier"
                            exportOptions={exportOptions(suppliers, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={suppliers}
                            selectedItems={selectedSuppliers}
                            onSelectItem={handleSelectSupplier}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                        />
                    </>

                )}

                <AddSupplierModal open={addSupplierOpen} onClose={() => setAddSupplierOpen(false)} onAddSuccess={() => dispatch(getSuppliers())} />
                <EditSupplierModal open={editSupplierOpen} onClose={() => setEditSupplierOpen(false)} supplier={selectedSupplier} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getSuppliers())} />
                <SupplierDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} supplier={selectedSupplier} onEdit={handleEditFromDrawer} />
                <DeleteModal
                    open={deleteSupplierOpen}
                    onClose={() => setDeleteSupplierOpen(false)}
                    items={getSelectedSuppliers()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/suppliers/delete-bulk"
                    title="Delete Suppliers"
                    message="Are you sure you want to delete the selected suppliers?"
                />
            </div>
        </div>
    );
};

export default SupplierPage;