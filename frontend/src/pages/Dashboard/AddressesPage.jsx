import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, BrownDeleteOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddAddressModal from '../../components/Modal/Address/AddAddressModal';
import DeleteAddressModal from '../../components/Modal/Address/DeleteAddressModal';
import EditAddressModal from '../../components/Modal/Address/EditAddressModal';
import { AuthContext } from '../../context/AuthContext';

const AddressesPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addAddressOpen, setAddAddressOpen] = useState(false);
    const [editAddressOpen, setEditAddressOpen] = useState(false);
    const [deleteAddressOpen, setDeleteAddressOpen] = useState(false);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const fetchAddresses = async () => {
        try {
            const response = await axiosInstance.get('/addresses/get');
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses', error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [addAddressOpen, editAddressOpen, deleteAddressOpen, axiosInstance]);

    const refreshAddresses = async () => {
        try {
            const response = await axiosInstance.get('/addresses/get');
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses', error);
        }
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex items-center justify-between w-full mb-4'>
                    <Typography variant='h5'>Addresses</Typography>
                    <OutlinedBrownButton onClick={() => setAddAddressOpen(true)} variant="outlined">Add Address</OutlinedBrownButton>
                </div>
                <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <BoldTableCell>Username</BoldTableCell>
                                <BoldTableCell>Name</BoldTableCell>
                                <BoldTableCell>Street</BoldTableCell>
                                <BoldTableCell>Country</BoldTableCell>
                                <BoldTableCell>City</BoldTableCell>
                                <BoldTableCell>Zip Code</BoldTableCell>
                                <BoldTableCell>Actions</BoldTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {addresses.length > 0 ? (
                                addresses.map((address) => (
                                    <TableRow key={address._id}>
                                        <TableCell>{address.user?.username}</TableCell>
                                        <TableCell>{address.name}</TableCell>
                                        <TableCell>{address.street}</TableCell>
                                        <TableCell>{address.country.name}</TableCell>
                                        <TableCell>{address.city.name}</TableCell>
                                        <TableCell>{address.city.zipCode}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedAddress(address); setEditAddressOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            <ActionButton onClick={() => { setSelectedAddress(address); setDeleteAddressOpen(true); }}><BrownDeleteOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No addresses found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <AddAddressModal open={addAddressOpen} onClose={() => setAddAddressOpen(false)} onAddSuccess={refreshAddresses} />
                <EditAddressModal open={editAddressOpen} onClose={() => setEditAddressOpen(false)} address={selectedAddress} onEditSuccess={refreshAddresses} />
                <DeleteAddressModal open={deleteAddressOpen} onClose={() => setDeleteAddressOpen(false)} address={selectedAddress} onDeleteSuccess={refreshAddresses} />
            </div>
        </div>
    );
};

export default AddressesPage;
