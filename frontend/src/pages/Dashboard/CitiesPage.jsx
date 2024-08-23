import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
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
    const itemsPerPage = 5;

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
        const id = Array.isArray(cityId) ? cityId[0] : cityId;

        setSelectedCities((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedCities(e.target.checked ? cities.map(city => city._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'country.name', label: 'Country' },
        { key: 'zipCode', label: 'Zip Code' },
        { key: 'actions', label: 'Actions' }
    ];

    const renderActionButtons = (city) => (
        <ActionButton onClick={() => { setSelectedCity(city); setEditCityOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>Cities</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddCityOpen(true)} className='!mr-4'>
                    Add City
                </OutlinedBrownButton>
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
    );

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardTable
                    columns={columns}
                    data={cities}
                    selectedItems={selectedCities}
                    onSelectItem={handleSelectCity}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                />

                <AddCityModal open={addCityOpen} onClose={() => setAddCityOpen(false)} onAddSuccess={fetchCities} />
                <EditCityModal open={editCityOpen} onClose={() => setEditCityOpen(false)} city={selectedCity} onEditSuccess={fetchCities} />
                <DeleteCityModal open={deleteCityOpen} onClose={() => setDeleteCityOpen(false)} cities={selectedCities.map(id => cities.find(city => city._id === id))} onDeleteSuccess={fetchCities} />
            </div>
        </div>
    );
};

export default CitiesPage;