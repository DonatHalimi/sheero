import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddCityModal from '../../components/Modal/City/AddCityModal';
import EditCityModal from '../../components/Modal/City/EditCityModal';
import DeleteModal from '../../components/Modal/DeleteModal';
import { getCities } from '../../store/actions/dashboardActions';

const CitiesPage = () => {
    const { cities } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedCities, setSelectedCities] = useState([]);
    const [addCityOpen, setAddCityOpen] = useState(false);
    const [editCityOpen, setEditCityOpen] = useState(false);
    const [deleteCityOpen, setDeleteCityOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getCities());
    }, [dispatch]);

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

                <AddCityModal open={addCityOpen} onClose={() => setAddCityOpen(false)} onAddSuccess={() => dispatch(getCities())} />
                <EditCityModal open={editCityOpen} onClose={() => setEditCityOpen(false)} city={selectedCity} onEditSuccess={() => dispatch(getCities())} />
                <DeleteModal
                    open={deleteCityOpen}
                    onClose={() => setDeleteCityOpen(false)}
                    items={selectedCities.map(id => cities.find(city => city._id === id)).filter(city => city)}
                    onDeleteSuccess={() => dispatch(getCities())}
                    endpoint="/cities/delete-bulk"
                    title="Delete Cities"
                    message="Are you sure you want to delete the selected cities?"
                />
            </div>
        </div>
    );
};

export default CitiesPage;