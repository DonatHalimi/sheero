import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddSubSubcategoryModal from '../../components/Modal/SubSubcategory/AddSubSubcategoryModal';
import DeleteSubSubcategoryModal from '../../components/Modal/SubSubcategory/DeleteSubSubcategoryModal';
import EditSubSubcategoryModal from '../../components/Modal/SubSubcategory/EditSubSubcategoryModal';
import { AuthContext } from '../../context/AuthContext';
import ReactPaginate from 'react-paginate';

const SubSubcategoriesPage = () => {
    const [subSubcategories, setSubSubcategories] = useState([]);
    const [selectedSubSubcategory, setSelectedSubSubcategory] = useState(null);
    const [selectedSubSubcategories, setSelectedSubSubcategories] = useState([]);
    const [addSubSubcategoryOpen, setAddSubSubcategoryOpen] = useState(false);
    const [editSubSubcategoryOpen, setEditSubSubcategoryOpen] = useState(false);
    const [deleteSubSubcategoryOpen, setDeleteSubSubcategoryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchSubSubcategories();
    }, [addSubSubcategoryOpen, editSubSubcategoryOpen, deleteSubSubcategoryOpen, axiosInstance]);

    const fetchSubSubcategories = async () => {
        try {
            const response = await axiosInstance.get('/subsubcategories/get');
            setSubSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subsubcategories', error);
        }
    };

    const handleSelectSubSubcategory = (subSubcategoryId) => {
        setSelectedSubSubcategories((prevSelected) => {
            if (prevSelected.includes(subSubcategoryId)) {
                return prevSelected.filter(id => id !== subSubcategoryId);
            } else {
                return [...prevSelected, subSubcategoryId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedSubSubcategories(subSubcategories.map(subSubcategory => subSubcategory._id));
        } else {
            setSelectedSubSubcategories([]);
        }
    };

    const pageCount = Math.ceil(subSubcategories.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = pageCount && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return subSubcategories.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>SubSubcategories</Typography>
                        <div>
                            <OutlinedBrownButton onClick={() => setAddSubSubcategoryOpen(true)} className='!mr-4'>Add SubSubcategory</OutlinedBrownButton>
                            {selectedSubSubcategories.length > 0 && (
                                <OutlinedBrownButton
                                    onClick={() => setDeleteSubSubcategoryOpen(true)}
                                    disabled={selectedSubSubcategories.length === 0}
                                >
                                    {selectedSubSubcategories.length > 1 ? 'Delete Selected SubSubcategories' : 'Delete SubSubcategory'}
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
                                            checked={selectedSubSubcategories.length === subSubcategories.length}
                                            onChange={handleSelectAll}
                                        />
                                    </BoldTableCell>
                                    <BoldTableCell>Name</BoldTableCell>
                                    <BoldTableCell>Subcategory</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getCurrentPageItems().length > 0 ? (
                                    getCurrentPageItems().map((subSubcategory) => (
                                        <TableRow key={subSubcategory._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedSubSubcategories.includes(subSubcategory._id)}
                                                    onChange={() => handleSelectSubSubcategory(subSubcategory._id)}
                                                />
                                            </TableCell>
                                            <TableCell>{subSubcategory.name}</TableCell>
                                            <TableCell>{subSubcategory.subcategory?.name}</TableCell>
                                            <TableCell>
                                                <ActionButton onClick={() => { setSelectedSubSubcategory(subSubcategory); setEditSubSubcategoryOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No subSubcategory found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <AddSubSubcategoryModal open={addSubSubcategoryOpen} onClose={() => setAddSubSubcategoryOpen(false)} onAddSuccess={fetchSubSubcategories} />
                    <EditSubSubcategoryModal open={editSubSubcategoryOpen} onClose={() => setEditSubSubcategoryOpen(false)} subSubcategory={selectedSubSubcategory} onEditSuccess={fetchSubSubcategories} />
                    <DeleteSubSubcategoryModal open={deleteSubSubcategoryOpen} onClose={() => setDeleteSubSubcategoryOpen(false)} subSubcategories={selectedSubSubcategories.map(id => subSubcategories.find(subSubcategory => subSubcategory._id === id))} onDeleteSuccess={fetchSubSubcategories} />

                    {subSubcategories.length > 0 && paginationEnabled && (
                        <div className="w-full flex justify-start mt-6 mb-24">
                            <ReactPaginate
                                pageCount={pageCount}
                                pageRangeDisplayed={2}
                                marginPagesDisplayed={1}
                                onPageChange={handlePageClick}
                                containerClassName="inline-flex -space-x-px text-sm"
                                activeClassName="text-stone-600 bg-stone-400 border-blue-500"
                                previousLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-e-0 border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isPreviousDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                                nextLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isNextDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                                disabledClassName="text-gray-50 cursor-not-allowed"
                                activeLinkClassName="text-white"
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

export default SubSubcategoriesPage;