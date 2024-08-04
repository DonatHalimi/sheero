import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddSubcategoryModal from '../../components/Modal/Subcategory/AddSubcategoryModal';
import DeleteSubcategoryModal from '../../components/Modal/Subcategory/DeleteSubcategoryModal';
import EditSubcategoryModal from '../../components/Modal/Subcategory/EditSubcategoryModal';
import { AuthContext } from '../../context/AuthContext';

const SubcategoriesPage = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedSubcategories, setSelectedSubcategories] = useState([]);
    const [addSubcategoryOpen, setAddSubcategoryOpen] = useState(false);
    const [editSubcategoryOpen, setEditSubcategoryOpen] = useState(false);
    const [deleteSubcategoryOpen, setDeleteSubcategoryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchSubcategories();
    }, [addSubcategoryOpen, editSubcategoryOpen, deleteSubcategoryOpen, axiosInstance]);

    const fetchSubcategories = async () => {
        try {
            const response = await axiosInstance.get('/subcategories/get');
            setSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subcategories', error);
        }
    };

    const handleSelectSubcategory = (subcategoryId) => {
        setSelectedSubcategories((prevSelected) => {
            if (prevSelected.includes(subcategoryId)) {
                return prevSelected.filter(id => id !== subcategoryId);
            } else {
                return [...prevSelected, subcategoryId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSubcategories(subcategories.map(subcategory => subcategory._id));
        } else {
            setSelectedSubcategories([]);
        }
    };

    const pageCount = Math.ceil(subcategories.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = pageCount && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return subcategories.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>Subcategories</Typography>
                        <div>
                            <OutlinedBrownButton onClick={() => setAddSubcategoryOpen(true)} className='!mr-4'>Add Subcategory</OutlinedBrownButton>
                            {selectedSubcategories.length > 0 && (
                                <OutlinedBrownButton
                                    onClick={() => setDeleteSubcategoryOpen(true)}
                                    disabled={selectedSubcategories.length === 0}
                                >
                                    {selectedSubcategories.length > 1 ? 'Delete Selected Subcategories' : 'Delete Subcategory'}
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
                                            checked={selectedSubcategories.length === subcategories.length}
                                            onChange={handleSelectAll}
                                        />
                                    </BoldTableCell>
                                    <BoldTableCell>Name</BoldTableCell>
                                    <BoldTableCell>Image</BoldTableCell>
                                    <BoldTableCell>Category</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getCurrentPageItems().length > 0 ? (
                                    getCurrentPageItems().map((subcategory) => (
                                        <TableRow key={subcategory._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedSubcategories.includes(subcategory._id)}
                                                    onChange={() => handleSelectSubcategory(subcategory._id)}
                                                />
                                            </TableCell>
                                            <TableCell>{subcategory?.name}</TableCell>
                                            <TableCell>
                                                <img className='rounded-md' src={`http://localhost:5000/${subcategory.image}`} alt="" width={80} />
                                            </TableCell>
                                            <TableCell>{subcategory.category?.name}</TableCell>
                                            <TableCell>
                                                <ActionButton onClick={() => { setSelectedSubcategory(subcategory); setEditSubcategoryOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No subcategory found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <AddSubcategoryModal open={addSubcategoryOpen} onClose={() => setAddSubcategoryOpen(false)} onAddSuccess={fetchSubcategories} />
                    <EditSubcategoryModal open={editSubcategoryOpen} onClose={() => setEditSubcategoryOpen(false)} subcategory={selectedSubcategory} onEditSuccess={fetchSubcategories} />
                    <DeleteSubcategoryModal open={deleteSubcategoryOpen} onClose={() => setDeleteSubcategoryOpen(false)} subcategories={selectedSubcategories.map(id => subcategories.find(subcategory => subcategory._id === id))} onDeleteSuccess={fetchSubcategories} />

                    {subcategories.length > 0 && paginationEnabled && (
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

export default SubcategoriesPage;