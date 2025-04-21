import React from 'react';
import { DashboardCountryFlag } from '../../assets/CustomComponents';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import CityDetailsDrawer from '../../components/Dashboard/Modal/City/CityDetailsDrawer';
import CityForm from '../../components/Dashboard/Modal/City/CityForm';
import { getCities } from '../../store/actions/dashboardActions';

const CitiesPage = () => {
    const itemsSelector = (state) => state.dashboard.cities;
    const loadingSelector = (state) => state.dashboard.loadingCities;

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

    const handleExport = (city) => ({
        ...city,
        country: city.country.name,
    });

    return (
        <DashboardPage
            title="Cities"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getCities}
            entityName="city"
            FormComponent={CityForm}
            DetailsDrawerComponent={CityDetailsDrawer}
            transformFunction={handleExport}
            formItemProp="city"
            detailsItemProp="city"
        />
    );
};

export default CitiesPage;