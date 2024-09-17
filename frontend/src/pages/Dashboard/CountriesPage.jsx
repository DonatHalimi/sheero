import React, { useContext, useEffect, useState } from 'react';
import { DashboardHeader } from '../../assets/CustomComponents.jsx';
import useAxios from '../../axiosInstance.js';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddCountryModal from '../../components/Modal/Country/AddCountryModal.jsx';
import EditCountryModal from '../../components/Modal/Country/EditCountryModal.jsx';
import DeleteModal from '../../components/Modal/DeleteModal.jsx';
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

    const handleEdit = (country) => {
        setSelectedCountry(country);
        setEditCountryOpen(true);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="Countries"
                    selectedItems={selectedCountries}
                    setAddItemOpen={setAddCountryOpen}
                    setDeleteItemOpen={setDeleteCountryOpen}
                    itemName="Country"
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
                />

                <AddCountryModal open={addCountryOpen} onClose={() => setAddCountryOpen(false)} onAddSuccess={fetchCountries} />
                <EditCountryModal open={editCountryOpen} onClose={() => setEditCountryOpen(false)} country={selectedCountry} onEditSuccess={fetchCountries} />
                <DeleteModal
                    open={deleteCountryOpen}
                    onClose={() => setDeleteCountryOpen(false)}
                    items={selectedCountries.map(id => countries.find(country => country._id === id)).filter(country => country)}
                    onDeleteSuccess={fetchCountries}
                    endpoint="/countries/delete-bulk"
                    title="Delete Countries"
                    message="Are you sure you want to delete the selected countries?"
                />
            </div>
        </div>
    );
};

export default CountriesPage;