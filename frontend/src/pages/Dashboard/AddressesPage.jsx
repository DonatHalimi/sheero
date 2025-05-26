import DashboardPage from '../../components/Dashboard/DashboardPage';
import AddressDetailsDrawer from '../../components/Dashboard/Modal/Address/AddressDetailsDrawer';
import AddressForm from '../../components/Dashboard/Modal/Address/AddressForm';
import { getAddresses } from '../../store/actions/dashboardActions';

const AddressesPage = () => {
    const itemsSelector = (state) => state.dashboard.addresses;
    const loadingSelector = (state) => state.dashboard.loadingAddresses;

    const columns = [
        { key: 'fullName', label: 'Full Name', render: (row) => `${row.user?.firstName} ${row.user?.lastName}` },
        { key: 'user.email', label: 'Email' },
        { key: 'name', label: 'Name' },
        { key: 'street', label: 'Street' },
        { key: 'phoneNumber', label: 'Phone Number' },
        { key: 'city.name', label: 'City, Country', render: (row) => `${row.city.name}, ${row.country.name}` },
        { key: 'city.zipCode', label: 'Zip Code' },
        { key: 'comment', label: 'Comment', render: (row) => row.comment || 'N/A' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (address) => ({
        ...address,
        user: address.user.email,
        city: address.city.name,
        country: address.country.name,
        comment: address.comment || 'N/A'
    })

    return (
        <DashboardPage
            title="Addresses"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getAddresses}
            entityName="address"
            FormComponent={AddressForm}
            DetailsDrawerComponent={AddressDetailsDrawer}
            transformFunction={handleExport}
            formItemProp="address"
            detailsItemProp="address"
        />
    );
};

export default AddressesPage;