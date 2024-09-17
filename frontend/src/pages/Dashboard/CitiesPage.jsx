import React, { useContext, useEffect, useState } from 'react';
import { DashboardHeader } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddCityModal from '../../components/Modal/City/AddCityModal';
import EditCityModal from '../../components/Modal/City/EditCityModal';
import DeleteModal from '../../components/Modal/DeleteModal';
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

    const handleEdit = (city) => {
        setSelectedCity(city);
        setEditCityOpen(true);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'country.name', label: 'Country' },
        { key: 'zipCode', label: 'Zip Code' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="Cities"
                    selectedItems={selectedCities}
                    setAddItemOpen={setAddCityOpen}
                    setDeleteItemOpen={setDeleteCityOpen}
                    itemName="City"
                />

                <DashboardTable
                    columns={columns}
                    data={cities}
                    selectedItems={selectedCities}
                    onSelectItem={handleSelectCity}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    onEdit={handleEdit}
                />

                <AddCityModal open={addCityOpen} onClose={() => setAddCityOpen(false)} onAddSuccess={fetchCities} />
                <EditCityModal open={editCityOpen} onClose={() => setEditCityOpen(false)} city={selectedCity} onEditSuccess={fetchCities} />
                <DeleteModal
                    open={deleteCityOpen}
                    onClose={() => setDeleteCityOpen(false)}
                    items={selectedCities.map(id => cities.find(city => city._id === id)).filter(city => city)}
                    onDeleteSuccess={fetchCities}
                    endpoint="/cities/delete-bulk"
                    title="Delete Cities"
                    message="Are you sure you want to delete the selected cities?"
                />
            </div>
        </div>
    );
};

export default CitiesPage;