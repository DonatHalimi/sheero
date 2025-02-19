import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { DashboardCountryFlag, DashboardHeader, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents.jsx';
import { exportToExcel, exportToJSON } from '../../assets/DataExport.jsx';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddCountryModal from '../../components/Modal/Country/AddCountryModal.jsx';
import CountryDetailsDrawer from '../../components/Modal/Country/CountryDetailsDrawer.jsx';
import EditCountryModal from '../../components/Modal/Country/EditCountryModal.jsx';
import DeleteModal from '../../components/Modal/DeleteModal.jsx';
import { getCountries } from '../../store/actions/addressActions.js';

const CountriesPage = () => {
    const { countries, loadingCountries } = useSelector((state) => state.address);
    const dispatch = useDispatch();

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [addCountryOpen, setAddCountryOpen] = useState(false);
    const [editCountryOpen, setEditCountryOpen] = useState(false);
    const [deleteCountryOpen, setDeleteCountryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getCountries());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddCountryOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [countries]);

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

    const handleEdit = (country) => {
        setSelectedCountry(country);
        setEditCountryOpen(true);
    };

    const handleEditFromDrawer = (country) => {
        setViewDetailsOpen(false);
        setSelectedCountry(country);
        setEditCountryOpen(true);
    };

    const getSelectedCountries = () => {
        return selectedCountries
            .map((id) => countries.find((country) => country._id === id))
            .filter((country) => country);
    };

    const handleDeleteSuccess = () => {
        dispatch(getCountries());
        setSelectedCountries([]);
    };

    const handleViewDetails = (country) => {
        setSelectedCountry(country);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedCountry(null);
    };

    const columns = [
        { key: 'countryCode', label: 'Code' },
        {
            key: 'name',
            label: 'Name',
            render: (country) => <DashboardCountryFlag countryCode={country.countryCode} name={country.name} />,
        },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        format === 'excel' ? exportToExcel(data, 'countries_data') : exportToJSON(data, 'countries_data');
    }

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingCountries ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Countries"
                            selectedItems={selectedCountries}
                            setAddItemOpen={setAddCountryOpen}
                            setDeleteItemOpen={setDeleteCountryOpen}
                            itemName="Country"
                            exportOptions={exportOptions(countries, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={countries}
                            selectedItems={selectedCountries}
                            onSelectItem={handleSelectCountry}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                        />
                    </>
                )}

                <AddCountryModal open={addCountryOpen} onClose={() => setAddCountryOpen(false)} onAddSuccess={() => dispatch(getCountries())} />
                <EditCountryModal open={editCountryOpen} onClose={() => setEditCountryOpen(false)} country={selectedCountry} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getCountries())} />
                <CountryDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} country={selectedCountry} onEdit={handleEditFromDrawer} />
                <DeleteModal
                    open={deleteCountryOpen}
                    onClose={() => setDeleteCountryOpen(false)}
                    items={getSelectedCountries()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/countries/delete-bulk"
                    title="Delete Countries"
                    message="Are you sure you want to delete the selected countries?"
                />
            </div>
        </div>
    );
};

export default CountriesPage;