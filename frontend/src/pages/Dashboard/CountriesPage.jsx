import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents.jsx';
import useAxios from '../../axiosInstance.js';
import DashboardTable from '../../components/Dashboard/DashboardTable';
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
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchCountries();
    }, [addCountryOpen, editCountryOpen, deleteCountryOpen, axiosInstance]);

    const fetchCountries = async () => {
        try {
            const response = await axiosInstance.get('/countries/get');
            setCountries(response.data);
        } catch (error) {
            console.error('Error fetching countries', error);
        }
    };

    const handleSelectCountry = (countryId) => {
        const id = Array.isArray(countryId) ? countryId[0] : countryId;

        setSelectedCountries((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedCountries(e.target.checked ? countries.map(country => country._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'actions', label: 'Actions' }
    ];

    const renderActionButtons = (country) => (
        <ActionButton onClick={() => { setSelectedCountry(country); setEditCountryOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>Countries</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddCountryOpen(true)} className='!mr-4'>
                    Add Country
                </OutlinedBrownButton>
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
    );

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardTable
                    columns={columns}
                    data={countries}
                    selectedItems={selectedCountries}
                    onSelectItem={handleSelectCountry}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                />

                <AddCountryModal open={addCountryOpen} onClose={() => setAddCountryOpen(false)} onAddSuccess={fetchCountries} />
                <EditCountryModal open={editCountryOpen} onClose={() => setEditCountryOpen(false)} country={selectedCountry} onEditSuccess={fetchCountries} />
                <DeleteCountryModal open={deleteCountryOpen} onClose={() => setDeleteCountryOpen(false)} countries={selectedCountries.map(id => countries.find(country => country._id === id))} onDeleteSuccess={fetchCountries} />
            </div>
        </div>
    );
};

export default CountriesPage;