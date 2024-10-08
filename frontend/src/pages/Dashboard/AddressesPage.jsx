import React, { useContext, useEffect, useState } from 'react';
import { DashboardHeader } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddAddressModal from '../../components/Modal/Address/AddAddressModal';
import EditAddressModal from '../../components/Modal/Address/EditAddressModal';
import DeleteModal from '../../components/Modal/DeleteModal';
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

    const columns = [
        { key: 'user.firstName', label: 'First Name' },
        { key: 'user.lastName', label: 'Last Name' },
        { key: 'user.email', label: 'Email' },
        { key: 'name', label: 'Name' },
        { key: 'street', label: 'Street' },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'comment', label: 'Comment' },
        { key: 'country.name', label: 'Country' },
        { key: 'city.name', label: 'City' },
        { key: 'city.zipCode', label: 'Zip Code' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="Addresses"
                    selectedItems={selectedAddresses}
                    setAddItemOpen={setAddAddressOpen}
                    setDeleteItemOpen={setDeleteAddressOpen}
                    itemName="Address"
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
                />

                <AddAddressModal open={addAddressOpen} onClose={() => setAddAddressOpen(false)} onAddSuccess={fetchAddresses} />
                <EditAddressModal open={editAddressOpen} onClose={() => setEditAddressOpen(false)} address={selectedAddress} onEditSuccess={fetchAddresses} />
                <DeleteModal
                    open={deleteAddressOpen}
                    onClose={() => setDeleteAddressOpen(false)}
                    items={selectedAddresses.map(id => addresses.find(address => address._id === id)).filter(address => address)}
                    onDeleteSuccess={fetchAddresses}
                    endpoint="/addresses/delete-bulk"
                    title="Delete Addresses"
                    message="Are you sure you want to delete the selected addresses?"
                />
            </div>
        </div>
    );
};

export default AddressesPage;
