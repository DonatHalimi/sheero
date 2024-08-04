import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import useAxios from '../../axiosInstance.js';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents.jsx';
import AddCountryModal from '../../components/Modal/Country/AddCountryModal.jsx';
import DeleteCountryModal from '../../components/Modal/Country/DeleteCountryModal.jsx';
import EditCountryModal from '../../components/Modal/Country/EditCountryModal.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

const CountriesPage = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [addCountryOpen, setAddCountryOpen] = useState(false);
    const [editCountryOpen, setEditCountryOpen] = useState(false);
    const [deleteCountryOpen, setDeleteCountryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchCountries();
    }, [addCountryOpen, editCountryOpen, deleteCountryOpen, axiosInstance]);

    const fetchCountries = async () => {
        try {
            const response = await axiosInstance.get('/countries/get');
            setCountries(response.data)
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const handleSelectCountry = (countryId) => {
        setSelectedCountries((prevSelected) => {
            if (prevSelected.includes(countryId)) {
                return prevSelected.filter(id => id !== countryId);
            } else {
                return [...prevSelected, countryId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            selectedCountries(countries.map(city => city._id));
        } else {
            selectedCountries([]);
        }
    };

    const pageCount = Math.ceil(countries.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = pageCount && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return countries.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex items-center justify-between w-full mb-4'>
                    <Typography variant='h5'>Countries</Typography>
                    <div>
                        <OutlinedBrownButton onClick={() => setAddCountryOpen(true)} className='!mr-4'>Add Country</OutlinedBrownButton>
                        {selectedCountries.length > 0 && (
                            <OutlinedBrownButton
                                onClick={() => setDeleteCountryOpen(true)}
                                disabled={selectedCountries.length === 0}
                            >
                                {selectedCountries.length > 1 ? 'Delete Selected Countries' : 'Delete Country'}
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
                                        checked={selectedCountries.length === countries.length}
                                        onChange={handleSelectAll}
                                    />
                                </BoldTableCell>
                                <BoldTableCell>Name</BoldTableCell>
                                <BoldTableCell>Actions</BoldTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getCurrentPageItems().length > 0 ? (
                                getCurrentPageItems().map((country) => (
                                    <TableRow key={country._id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedCountries.includes(country._id)}
                                                onChange={() => handleSelectCountry(country._id)}
                                            />
                                        </TableCell>
                                        <TableCell>{country.name}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedCountry(country); setEditCountryOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        No countries found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <AddCountryModal open={addCountryOpen} onClose={() => setAddCountryOpen(false)} onAddSuccess={fetchCountries} />
                <EditCountryModal open={editCountryOpen} onClose={() => setEditCountryOpen(false)} country={selectedCountry} onEditSuccess={fetchCountries} />
                <DeleteCountryModal open={deleteCountryOpen} onClose={() => setDeleteCountryOpen(false)} countries={selectedCountries.map(id => countries.find(country => country._id === id))} onDeleteSuccess={fetchCountries} />

                {countries.length > 0 && paginationEnabled && (
                    <div className="w-full flex justify-start mt-6 mb-24">
                        <ReactPaginate
                            pageCount={pageCount}
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={1}
                            onPageChange={handlePageClick}
                            containerClassName="inline-flex -space-x-px text-sm"
                            activeClassName="text-white bg-stone-500"
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
    );
};

export default CountriesPage;