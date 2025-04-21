import React from 'react';
import { DashboardCountryFlag } from '../../assets/CustomComponents';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import CountryDetailsDrawer from '../../components/Dashboard/Modal/Country/CountryDetailsDrawer';
import CountryForm from '../../components/Dashboard/Modal/Country/CountryForm';
import { getCountries } from '../../store/actions/addressActions';

const CountriesPage = () => {
    const itemsSelector = (state) => state.address.countries;
    const loadingSelector = (state) => state.address.loadingCountries;

    const columns = [
        { key: 'countryCode', label: 'Code' },
        {
            key: 'name',
            label: 'Name',
            render: (country) => <DashboardCountryFlag countryCode={country.countryCode} name={country.name} />,
        },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <DashboardPage
            title="Countries"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getCountries}
            entityName="country"
            FormComponent={CountryForm}
            DetailsDrawerComponent={CountryDetailsDrawer}
            transformFunction={(item) => item}
            formItemProp="country"
            detailsItemProp="country"
        />
    );
};

export default CountriesPage;