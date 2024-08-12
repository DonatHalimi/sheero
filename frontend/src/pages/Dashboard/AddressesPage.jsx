import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddAddressModal from '../../components/Modal/Address/AddAddressModal';
import DeleteAddressModal from '../../components/Modal/Address/DeleteAddressModal';
import EditAddressModal from '../../components/Modal/Address/EditAddressModal';
import { AuthContext } from '../../context/AuthContext';

const AddressesPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [addAddressOpen, setAddAddressOpen] = useState(false);
    const [editAddressOpen, setEditAddressOpen] = useState(false);
    const [deleteAddressOpen, setDeleteAddressOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchAddresses();
    }, [addAddressOpen, editAddressOpen, deleteAddressOpen, axiosInstance]);

    const fetchAddresses = async () => {
        try {
            const response = await axiosInstance.get('/addresses/get');
            setAddresses(response.data)
        } catch (error) {
            console.error('Error fetching addresses', error);
        }
    };

    const handleSelectAddress = (addressId) => {
        setSelectedAddresses((prevSelected) =>
            prevSelected.includes(addressId)
                ? prevSelected.filter(id => id !== addressId)
                : [...prevSelected, addressId]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedAddresses(e.target.checked ? addresses.map(address => address._id) : []);
    };

    const columns = [
        { key: 'checkbox', label: 'checkbox' },
        { key: 'user.username', label: 'Username' },
        { key: 'name', label: 'Name' },
        { key: 'street', label: 'Street' },
        { key: 'country.name', label: 'Country' },
        { key: 'city.name', label: 'City' },
        { key: 'city.zipCode', label: 'Zip Code' },
        { key: 'actions', label: 'Actions' }
    ];

    const renderActionButtons = (address) => (
        <ActionButton onClick={() => { setSelectedAddress(address); setEditAddressOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>Addresses</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddAddressOpen(true)} className='!mr-4'>Add Address</OutlinedBrownButton>
                {selectedAddresses.length > 0 && (
                    <OutlinedBrownButton
                        onClick={() => setDeleteAddressOpen(true)}
                        disabled={selectedAddresses.length === 0}
                    >
                        {selectedAddresses.length > 1 ? 'Delete Selected Addresses' : 'Delete Address'}
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
                    data={addresses}
                    selectedItems={selectedAddresses}
                    onSelectItem={handleSelectAddress}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(event) => setCurrentPage(event.selected)}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                />

                <AddAddressModal open={addAddressOpen} onClose={() => setAddAddressOpen(false)} onAddSuccess={fetchAddresses} />
                <EditAddressModal open={editAddressOpen} onClose={() => setEditAddressOpen(false)} address={selectedAddress} onEditSuccess={fetchAddresses} />
                <DeleteAddressModal open={deleteAddressOpen} onClose={() => setDeleteAddressOpen(false)} addresses={selectedAddresses.map(id => addresses.find(address => address._id === id))} onDeleteSuccess={fetchAddresses} />
            </div>
        </div>
    );
};

export default AddressesPage;