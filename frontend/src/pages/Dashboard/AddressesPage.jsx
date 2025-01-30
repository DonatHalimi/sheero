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
    const [deleteAddressOpen, setDeleteAddressOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getAddresses());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddAddressOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [addresses]);

    const handleSelectAddress = (addressId) => {
        const id = Array.isArray(addressId) ? addressId[0] : addressId;

        setSelectedAddresses((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedAddresses(e.target.checked ? addresses.map(address => address._id) : []);
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

    const getSelectedAddresses = () => {
        return selectedAddresses
            .map((id) => addresses.find((address) => address._id === id))
            .filter((address) => address);
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
        }))

        format === 'excel' ? exportToExcel(flattenedAddress, 'addresses_data') : exportToJSON(data, 'addresses_data');
    }

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
                            setDeleteItemOpen={setDeleteAddressOpen}
                            itemName="Address"
                            exportOptions={exportOptions(addresses, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={addresses}
                            selectedItems={selectedAddresses}
                            onSelectItem={handleSelectAddress}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={(event) => setCurrentPage(event.selected)}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                        />
                    </>
                )}

                <AddAddressModal open={addAddressOpen} onClose={() => setAddAddressOpen(false)} onAddSuccess={() => dispatch(getAddresses())} />
                <EditAddressModal open={editAddressOpen} onClose={() => setEditAddressOpen(false)} address={selectedAddress} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getAddresses())} />
                <AddressDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} address={selectedAddress} onEdit={handleEditFromDrawer} />
                <DeleteModal
                    open={deleteAddressOpen}
                    onClose={() => setDeleteAddressOpen(false)}
                    items={getSelectedAddresses()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/addresses/delete-bulk"
                    title="Delete Addresses"
                    message="Are you sure you want to delete the selected addresses?"
                />
            </div>
        </div>
    );
};

export default AddressesPage;