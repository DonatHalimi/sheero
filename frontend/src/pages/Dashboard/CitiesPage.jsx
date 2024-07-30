import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
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
    const [fetchErrorCount, setFetchErrorCount] = useState(0);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axiosInstance.get('/cities/get');
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities', error);
            }
        };

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
                            {cities.length > 0 ? (
                                cities.map((city) => (
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
                <DeleteCityModal open={deleteCityOpen} onClose={() => setDeleteCityOpen(false)} cities={selectedCities.map(id => cities.find(city => city._id === id))} onDeleteSuccess={refreshCities} />
            </div>
        </div>
    );
};

export default CitiesPage;
