import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddAddressModal from '../../components/Modal/Address/AddAddressModal';
import AddressDetailsDrawer from '../../components/Modal/Address/AddressDetailsDrawer';
import EditAddressModal from '../../components/Modal/Address/EditAddressModal';
import DeleteModal from '../../components/Modal/DeleteModal';
import { getAddresses } from '../../store/actions/dashboardActions';

const AddressesPage = () => {
    const { addresses, loadingAddresses } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [addAddressOpen, setAddAddressOpen] = useState(false);
    const [editAddressOpen, setEditAddressOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getAddresses());
    }, [dispatch]);

    const handleSelectAddress = (newSelection) => {
        setSelectedAddresses(newSelection);
    };

    const handleEdit = (address) => {
        setSelectedAddress(address);
        setEditAddressOpen(true);
    };

    const handleEditFromDrawer = (address) => {
        setViewDetailsOpen(false);
        setSelectedAddress(address);
        setEditAddressOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getAddresses());
        setSelectedAddresses([]);
    };

    const handleViewDetails = (address) => {
        setSelectedAddress(address);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedAddress(null);
    };

    const handleBulkDelete = () => {
        if (selectedAddresses.length > 0) {
            setDeletionContext({
                endpoint: '/addresses/delete-bulk',
                data: { ids: selectedAddresses },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (address) => {
        setDeletionContext({
            endpoint: `/addresses/delete/${address._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { key: 'fullName', label: 'Full Name', render: (row) => `${row.user?.firstName} ${row.user?.lastName}` },
        { key: 'user.email', label: 'Email' },
        { key: 'name', label: 'Name' },
        { key: 'street', label: 'Street' },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'city.name', label: 'City / Country', render: (row) => `${row.city.name}, ${row.country.name}` },
        { key: 'city.zipCode', label: 'Zip Code' },
        { key: 'comment', label: 'Comment', render: (row) => row.comment || 'N/A' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        const flattenedAddress = data.map(address => ({
            ...address,
            user: address.user.email,
            city: address.city.name,
            country: address.country.name,
            comment: address.comment || 'N/A'
        }));

        format === 'excel' ? exportToExcel(flattenedAddress, 'addresses_data') : exportToJSON(data, 'addresses_data');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingAddresses ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Addresses"
                            selectedItems={selectedAddresses}
                            setAddItemOpen={setAddAddressOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Address"
                            exportOptions={exportOptions(addresses, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={addresses}
                            selectedItems={selectedAddresses}
                            onSelectItem={handleSelectAddress}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={(event) => setCurrentPage(event.selected)}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddAddressModal open={addAddressOpen} onClose={() => setAddAddressOpen(false)} onAddSuccess={() => dispatch(getAddresses())} />
                <EditAddressModal open={editAddressOpen} onClose={() => setEditAddressOpen(false)} address={selectedAddress} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getAddresses())} />
                <AddressDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} address={selectedAddress} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Addresses' : 'Delete Address'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected addresses?'
                        : 'Are you sure you want to delete this address?'
                    }
                />
            </div>
        </div>
    );
};

export default AddressesPage;