import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
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

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axiosInstance.get('/countries/get');
                setCountries(response.data)
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        fetchCountries();
    }, [addCountryOpen, editCountryOpen, deleteCountryOpen, axiosInstance]);

    const refreshCountries = async () => {
        try {
            const response = await axiosInstance.get('/countries/get');
            setCountries(response.data);
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
                            {countries.length > 0 ? (
                                countries.map((country) => (
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

                <AddCountryModal open={addCountryOpen} onClose={() => setAddCountryOpen(false)} onAddSuccess={refreshCountries} />
                <EditCountryModal open={editCountryOpen} onClose={() => setEditCountryOpen(false)} country={selectedCountry} onEditSuccess={refreshCountries} />
                <DeleteCountryModal open={deleteCountryOpen} onClose={() => setDeleteCountryOpen(false)} countries={selectedCountries.map(id => countries.find(country => country._id === id))} onDeleteSuccess={refreshCountries} />
            </div>
        </div>
    );
};

export default CountriesPage;
