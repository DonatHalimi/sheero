import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance.js';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, BrownDeleteOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents.jsx';
import AddCountryModal from '../../components/Modal/Country/AddCountryModal.jsx';
import DeleteCountryModal from '../../components/Modal/Country/DeleteCountryModal.jsx';
import EditCountryModal from '../../components/Modal/Country/EditCountryModal.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

const CountriesPage = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
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
                console.error('Error fetching countries', error);
            }
        };

        fetchCountries();
    }, [addCountryOpen, editCountryOpen, deleteCountryOpen, axiosInstance]);

    const refreshCountries = async () => {
        try {
            const response = await axiosInstance.get('/countries/get');
            setCountries(response.data);
        } catch (error) {
            console.error('Error fetching countries', error);
        }
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex items-center justify-between w-full mb-4'>
                    <Typography variant='h5'>Countries</Typography>
                    <OutlinedBrownButton onClick={() => setAddCountryOpen(true)} variant="outlined">Add Country</OutlinedBrownButton>
                </div>
                <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <BoldTableCell>Name</BoldTableCell>
                                <BoldTableCell>Actions</BoldTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {countries.length > 0 ? (
                                countries.map((country) => (
                                    <TableRow key={country._id}>
                                        <TableCell>{country.name}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedCountry(country); setEditCountryOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            <ActionButton onClick={() => { setSelectedCountry(country); setDeleteCountryOpen(true); }}><BrownDeleteOutlinedIcon /></ActionButton>
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
                <DeleteCountryModal open={deleteCountryOpen} onClose={() => setDeleteCountryOpen(false)} country={selectedCountry} onDeleteSuccess={refreshCountries} />
            </div>
        </div>
    );
};

export default CountriesPage;
