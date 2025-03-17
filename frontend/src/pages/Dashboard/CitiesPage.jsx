import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardCountryFlag, DashboardHeader, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddCityModal from '../../components/Modal/City/AddCityModal';
import CityDetailsDrawer from '../../components/Modal/City/CityDetailsDrawer';
import EditCityModal from '../../components/Modal/City/EditCityModal';
import DeleteModal from '../../components/Modal/DeleteModal';
import { getCities } from '../../store/actions/dashboardActions';

const CitiesPage = () => {
    const { cities, loadingCities } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedCities, setSelectedCities] = useState([]);
    const [addCityOpen, setAddCityOpen] = useState(false);
    const [editCityOpen, setEditCityOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getCities());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddCityOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [cities]);

    const handleSelectCity = (newSelection) => {
        setSelectedCities(newSelection);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (city) => {
        setSelectedCity(city);
        setEditCityOpen(true);
    };

    const handleEditFromDrawer = (city) => {
        setViewDetailsOpen(false);
        setSelectedCity(city);
        setEditCityOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getCities());
        setSelectedCities([]);
    };

    const handleViewDetails = (city) => {
        setSelectedCity(city);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedCity(null);
    };

    const handleBulkDelete = () => {
        if (selectedCities.length > 0) {
            setDeletionContext({
                endpoint: '/cities/delete-bulk',
                data: { ids: selectedCities },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (city) => {
        setDeletionContext({
            endpoint: `/cities/delete/${city._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        {
            key: 'country.name',
            label: 'Country',
            render: (row) => <DashboardCountryFlag countryCode={row.country.countryCode} name={row.country.name} />
        },
        { key: 'zipCode', label: 'Zip Code' },
        { key: 'actions', label: 'Actions' },
    ];

    const handleExport = (data, format) => {
        const flattenedCities = data.map(city => ({
            ...city,
            country: city.country.name
        }));

        format === 'excel' ? exportToExcel(flattenedCities, 'cities_data') : exportToJSON(data, 'cities_data');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingCities ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Cities"
                            selectedItems={selectedCities}
                            setAddItemOpen={setAddCityOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="City"
                            exportOptions={exportOptions(cities, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={cities}
                            selectedItems={selectedCities}
                            onSelectItem={handleSelectCity}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddCityModal open={addCityOpen} onClose={() => setAddCityOpen(false)} onAddSuccess={() => dispatch(getCities())} />
                <EditCityModal open={editCityOpen} onClose={() => setEditCityOpen(false)} city={selectedCity} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getCities())} />
                <CityDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} city={selectedCity} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Cities' : 'Delete City'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected cities?'
                        : 'Are you sure you want to delete this city?'
                    }
                />
            </div>
        </div>
    );
};

export default CitiesPage;