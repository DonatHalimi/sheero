import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, BrownDeleteOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddSubcategoryModal from '../../components/Modal/Supplier/AddSupplierModal';
import DeleteSubcategoryModal from '../../components/Modal/Supplier/DeleteSupplierModal';
import EditSubcategoryModal from '../../components/Modal/Supplier/EditSupplierModal';
import { AuthContext } from '../../context/AuthContext';

const SubcategoriesPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
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
                toast.error('Error fetching suppliers');
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

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>Suppliers</Typography>
                        <OutlinedBrownButton onClick={() => setAddSupplierOpen(true)}>Add Supplier</OutlinedBrownButton>
                    </div>
                    <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <BoldTableCell>Name</BoldTableCell>
                                    <BoldTableCell>Email</BoldTableCell>
                                    <BoldTableCell>Phone Number</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {suppliers.map((supplier) => (
                                    <TableRow key={supplier._id}>
                                        <TableCell>{supplier.name}</TableCell>
                                        <TableCell>{supplier.contactInfo.email}</TableCell>
                                        <TableCell>{supplier.contactInfo.phoneNumber}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedSupplier(supplier); setEditSupplierOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            <ActionButton onClick={() => { setSelectedSupplier(supplier); setDeleteSupplierOpen(true); }}><BrownDeleteOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <AddSubcategoryModal open={addSupplierOpen} onClose={() => setAddSupplierOpen(false)} onAddSuccess={refreshSuppliers} />
                    <EditSubcategoryModal open={editSupplierOpen} onClose={() => setEditSupplierOpen(false)} supplier={selectedSupplier} onEditSuccess={refreshSuppliers} />
                    <DeleteSubcategoryModal open={deleteSupplierOpen} onClose={() => setDeleteSupplierOpen(false)} supplier={selectedSupplier} onDeleteSuccess={refreshSuppliers} />
                </div>
            </div>
        </>
    );
};

export default SubcategoriesPage;
