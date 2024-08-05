import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
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
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

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

    const pageCount = Math.ceil(suppliers.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = pageCount && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return suppliers.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
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
                                {getCurrentPageItems().length > 0 ? (
                                    getCurrentPageItems().map((supplier) => (
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
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No supplier found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <AddSupplierModal open={addSupplierOpen} onClose={() => setAddSupplierOpen(false)} onAddSuccess={fetchSuppliers} />
                    <EditSupplierModal open={editSupplierOpen} onClose={() => setEditSupplierOpen(false)} supplier={selectedSupplier} onEditSuccess={fetchSuppliers} />
                    <DeleteSupplierModal open={deleteSupplierOpen} onClose={() => setDeleteSupplierOpen(false)} suppliers={selectedSuppliers.map(id => suppliers.find(supplier => supplier._id === id))} onDeleteSuccess={fetchSuppliers} />

                    {suppliers.length > 0 && paginationEnabled && (
                        <div className="w-full flex justify-start mt-6 mb-24">
                            <ReactPaginate
                                pageCount={pageCount}
                                pageRangeDisplayed={2}
                                marginPagesDisplayed={1}
                                onPageChange={handlePageClick}
                                containerClassName="inline-flex -space-x-px text-sm"
                                activeClassName="text-stone-600 bg-stone-500 border-blue-500"
                                previousLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-e-0 border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isPreviousDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                                nextLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isNextDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                                disabledClassName="text-gray-50 cursor-not-allowed"
                                activeLinkClassName="text-stone-600 font-extrabold"
                                previousLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 hover:text-gray-700">Previous</span>}
                                nextLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 hover:text-gray-700">Next</span>}
                                breakLabel={<span className="flex items-center justify-center px-4 h-10 text-gray-500 bg-white border border-gray-300">...</span>}
                                pageClassName="flex items-center justify-center px-1 h-10 text-gray-500 border border-gray-300 cursor-pointer bg-white"
                                pageLinkClassName="flex items-center justify-center px-3 h-10 text-gray-500 cursor-pointer"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SupplierPage;