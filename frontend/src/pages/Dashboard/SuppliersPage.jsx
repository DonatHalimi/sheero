import DashboardPage from '../../components/Dashboard/DashboardPage';
import SupplierDetailsDrawer from '../../components/Dashboard/Modal/Supplier/SupplierDetailsDrawer';
import SupplierForm from '../../components/Dashboard/Modal/Supplier/SupplierForm';
import { getSuppliers } from '../../store/actions/dashboardActions';

const SupplierPage = () => {
    const itemsSelector = (state) => state.dashboard.suppliers;
    const loadingSelector = (state) => state.dashboard.loadingSuppliers;

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'contactInfo.email', label: 'Email' },
        { key: 'contactInfo.phoneNumber', label: 'Phone Number' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (supplier) => ({
        ...supplier,
        contactInfo: `${supplier.contactInfo.email} - ${supplier.contactInfo.phoneNumber}`
    });

    return (
        <DashboardPage
            title="Suppliers"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getSuppliers}
            entityName="supplier"
            FormComponent={SupplierForm}
            DetailsDrawerComponent={SupplierDetailsDrawer}
            transformFunction={handleExport}
            formItemProp="supplier"
            detailsItemProp="supplier"
        />
    );
};

export default SupplierPage;