import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, BrownDeleteOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddCityModal from '../../components/Modal/City/AddCityModal';
import DeleteCityModal from '../../components/Modal/City/DeleteCityModal';
import EditCityModal from '../../components/Modal/City/EditCityModal';
import { AuthContext } from '../../context/AuthContext';

const CitiesPage = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [addCityOpen, setAddCityOpen] = useState(false);
    const [editCityOpen, setEditCityOpen] = useState(false);
    const [deleteCityOpen, setDeleteCityOpen] = useState(false);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const fetchCities = async () => {
        try {
            const response = await axiosInstance.get('/cities/get');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities', error);
        }
    };

    useEffect(() => {
        fetchCities();
    }, [addCityOpen, editCityOpen, deleteCityOpen, axiosInstance]);

    const refreshCities = async () => {
        try {
            const response = await axiosInstance.get('/cities/get');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities', error);
        }
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex items-center justify-between w-full mb-4'>
                    <Typography variant='h5'>Cities</Typography>
                    <OutlinedBrownButton onClick={() => setAddCityOpen(true)} variant="outlined">Add City</OutlinedBrownButton>
                </div>
                <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <BoldTableCell>Name</BoldTableCell>
                                <BoldTableCell>Country</BoldTableCell>
                                <BoldTableCell>Zip Code</BoldTableCell>
                                <BoldTableCell>Actions</BoldTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cities.length > 0 ? (
                                cities.map((city) => (
                                    <TableRow key={city._id}>
                                        <TableCell>{city.name}</TableCell>
                                        <TableCell>{city.country.name}</TableCell>
                                        <TableCell>{city.zipCode}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedCity(city); setEditCityOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            <ActionButton onClick={() => { setSelectedCity(city); setDeleteCityOpen(true); }}><BrownDeleteOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No cities found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <AddCityModal open={addCityOpen} onClose={() => setAddCityOpen(false)} onAddSuccess={refreshCities} />
                <EditCityModal open={editCityOpen} onClose={() => setEditCityOpen(false)} city={selectedCity} onEditSuccess={refreshCities} />
                <DeleteCityModal open={deleteCityOpen} onClose={() => setDeleteCityOpen(false)} city={selectedCity} onDeleteSuccess={refreshCities} />
            </div>
        </div>
    );
};

export default CitiesPage;
