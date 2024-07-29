import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddSupplierModal from '../../components/Modal/Supplier/AddSupplierModal';
import DeleteSupplierModal from '../../components/Modal/Supplier/DeleteSupplierModal';
import EditSupplierModal from '../../components/Modal/Supplier/EditSupplierModal';
import { AuthContext } from '../../context/AuthContext';

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedSuppliers, setSelectedSuppliers] = useState([]);
    const [addSupplierOpen, setAddSupplierOpen] = useState(false);
    const [editSupplierOpen, setEditSupplierOpen] = useState(false);
    const [deleteSupplierOpen, setDeleteSupplierOpen] = useState(false);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axiosInstance.get('/suppliers/get');
                setSuppliers(response.data);
            } catch (error) {
                console.error('Error fetching suppliers', error);
            }
        };

        fetchSuppliers();
    }, [addSupplierOpen, editSupplierOpen, deleteSupplierOpen, axiosInstance]);

    const refreshSuppliers = async () => {
        try {
            const response = await axiosInstance.get('/suppliers/get');
            setSuppliers(response.data)
        } catch (error) {
            console.error('Error fetching suppliers', error);
        }
    };

    const handleSelectSupplier = (supplierId) => {
        setSelectedSuppliers((prevSelected) => {
            if (prevSelected.includes(supplierId)) {
                return prevSelected.filter(id => id !== supplierId);
            } else {
                return [...prevSelected, supplierId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSuppliers(suppliers.map(supplier => supplier._id));
        } else {
            setSelectedSuppliers([]);
        }
    };

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>Suppliers</Typography>
                        <div>
                            <OutlinedBrownButton onClick={() => setAddSupplierOpen(true)} className='!mr-4'>Add Supplier</OutlinedBrownButton>
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
                    <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <BoldTableCell>
                                        <Checkbox
                                            checked={selectedSuppliers.length === suppliers.length}
                                            onChange={handleSelectAll}
                                        />
                                    </BoldTableCell>
                                    <BoldTableCell>Name</BoldTableCell>
                                    <BoldTableCell>Email</BoldTableCell>
                                    <BoldTableCell>Phone Number</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {suppliers.map((supplier) => (
                                    <TableRow key={supplier._id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedSuppliers.includes(supplier._id)}
                                                onChange={() => handleSelectSupplier(supplier._id)}
                                            />
                                        </TableCell>
                                        <TableCell>{supplier?.name}</TableCell>
                                        <TableCell>{supplier.contactInfo?.email}</TableCell>
                                        <TableCell>{supplier.contactInfo?.phoneNumber}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedSupplier(supplier); setEditSupplierOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <AddSupplierModal open={addSupplierOpen} onClose={() => setAddSupplierOpen(false)} onAddSuccess={refreshSuppliers} />
                    <EditSupplierModal open={editSupplierOpen} onClose={() => setEditSupplierOpen(false)} supplier={selectedSupplier} onEditSuccess={refreshSuppliers} />
                    <DeleteSupplierModal open={deleteSupplierOpen} onClose={() => setDeleteSupplierOpen(false)} suppliers={selectedSuppliers.map(id => suppliers.find(supplier => supplier._id === id))} onDeleteSuccess={refreshSuppliers} />
                </div>
            </div>
        </>
    );
};

export default SupplierPage;