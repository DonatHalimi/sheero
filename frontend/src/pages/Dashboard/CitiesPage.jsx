import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import AddCityModal from '../../components/Modal/City/AddCityModal';
import DeleteCityModal from '../../components/Modal/City/DeleteCityModal';
import EditCityModal from '../../components/Modal/City/EditCityModal';
import { AuthContext } from '../../context/AuthContext';

const CitiesPage = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedCities, setSelectedCities] = useState([]);
    const [addCityOpen, setAddCityOpen] = useState(false);
    const [editCityOpen, setEditCityOpen] = useState(false);
    const [deleteCityOpen, setDeleteCityOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchCities();
    }, [addCityOpen, editCityOpen, deleteCityOpen, axiosInstance]);

    const fetchCities = async () => {
        try {
            const response = await axiosInstance.get('/cities/get');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities', error);
        }
    };

    const handleSelectCity = (cityId) => {
        setSelectedCities((prevSelected) => {
            if (prevSelected.includes(cityId)) {
                return prevSelected.filter(id => id !== cityId);
            } else {
                return [...prevSelected, cityId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCities(cities.map(city => city._id));
        } else {
            setSelectedCities([]);
        }
    };

    const pageCount = Math.ceil(cities.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = pageCount && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return cities.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex items-center justify-between w-full mb-4'>
                    <Typography variant='h5'>Cities</Typography>
                    <div>
                        <OutlinedBrownButton onClick={() => setAddCityOpen(true)} className='!mr-4'>Add City</OutlinedBrownButton>
                        {selectedCities.length > 0 && (
                            <OutlinedBrownButton
                                onClick={() => setDeleteCityOpen(true)}
                                disabled={selectedCities.length === 0}
                            >
                                {selectedCities.length > 1 ? 'Delete Selected Cities' : 'Delete City'}
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
                                        checked={selectedCities.length === cities.length}
                                        onChange={handleSelectAll}
                                    />
                                </BoldTableCell>
                                <BoldTableCell>Name</BoldTableCell>
                                <BoldTableCell>Country</BoldTableCell>
                                <BoldTableCell>Zip Code</BoldTableCell>
                                <BoldTableCell>Actions</BoldTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getCurrentPageItems().length > 0 ? (
                                getCurrentPageItems().map((city) => (
                                    <TableRow key={city._id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedCities.includes(city._id)}
                                                onChange={() => handleSelectCity(city._id)}
                                            />
                                        </TableCell>
                                        <TableCell>{city.name}</TableCell>
                                        <TableCell>{city.country.name}</TableCell>
                                        <TableCell>{city.zipCode}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedCity(city); setEditCityOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No city found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <AddCityModal open={addCityOpen} onClose={() => setAddCityOpen(false)} onAddSuccess={fetchCities} />
                <EditCityModal open={editCityOpen} onClose={() => setEditCityOpen(false)} city={selectedCity} onEditSuccess={fetchCities} />
                <DeleteCityModal open={deleteCityOpen} onClose={() => setDeleteCityOpen(false)} cities={selectedCities.map(id => cities.find(city => city._id === id))} onDeleteSuccess={fetchCities} />

                {cities.length > 0 && paginationEnabled && (
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

export default CitiesPage;