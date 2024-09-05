import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddSupplierModal from '../../components/Modal/Supplier/AddSupplierModal';
import EditSupplierModal from '../../components/Modal/Supplier/EditSupplierModal';
import { AuthContext } from '../../context/AuthContext';

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSuppliers, setSelectedSuppliers] = useState([]);
    const [addSupplierOpen, setAddSupplierOpen] = useState(false);
    const [editSupplierOpen, setEditSupplierOpen] = useState(false);
    const [deleteSupplierOpen, setDeleteSupplierOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);
    
    useEffect(() => {
        fetchSuppliers();
    }, [addSupplierOpen, editSupplierOpen, deleteSupplierOpen, axiosInstance]);

    const fetchSuppliers = async () => {
        try {
            const response = await axiosInstance.get('/suppliers/get');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers', error);
        }
    };

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

    const columns = [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'contactInfo.email' },
        { label: 'Phone Number', key: 'contactInfo.phoneNumber' },
        { label: 'Actions', key: 'actions' }
    ];

    const renderActionButtons = (supplier) => (
        <ActionButton onClick={() => { setSelectedSupplier(supplier); setEditSupplierOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>Suppliers</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddSupplierOpen(true)} className='!mr-4'>
                    Add Supplier
                </OutlinedBrownButton>
                {selectedSuppliers.length > 0 && (
                    <OutlinedBrownButton
                        onClick={() => setDeleteSupplierOpen(true)}
                        disabled={selectedSuppliers.length === 0}
                    >
                        {selectedSuppliers.length > 1 ? 'Delete Selected Suppliers' : 'Delete Supplier'}
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
                    data={suppliers}
                    selectedItems={selectedSuppliers}
                    onSelectItem={handleSelectSupplier}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                />

                <AddSupplierModal open={addSupplierOpen} onClose={() => setAddSupplierOpen(false)} onAddSuccess={fetchSuppliers} />
                <EditSupplierModal open={editSupplierOpen} onClose={() => setEditSupplierOpen(false)} supplier={selectedSupplier} onEditSuccess={fetchSuppliers} />
                <DeleteModal
                    open={deleteSupplierOpen}
                    onClose={() => setDeleteSupplierOpen(false)}
                    items={selectedSuppliers.map(id => suppliers.find(supplier => supplier._id === id)).filter(supplier => supplier)}
                    onDeleteSuccess={fetchSuppliers}
                    endpoint="/suppliers/delete-bulk"
                    title="Delete Suppliers"
                    message="Are you sure you want to delete the selected suppliers?"
                />
            </div>
        </div>
    );
};

export default SupplierPage;