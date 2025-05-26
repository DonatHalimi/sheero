import DashboardPage from '../../components/Dashboard/DashboardPage';
import RoleDetailsDrawer from '../../components/Dashboard/Modal/Role/RoleDetailsDrawer';
import RoleForm from '../../components/Dashboard/Modal/Role/RoleForm';
import { getRoles } from '../../store/actions/dashboardActions';

const RolesPage = () => {
    const itemsSelector = (state) => state.dashboard.roles;
    const loadingSelector = (state) => state.dashboard.loadingRoles;

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <DashboardPage
            title="Roles"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getRoles}
            entityName="role"
            FormComponent={RoleForm}
            DetailsDrawerComponent={RoleDetailsDrawer}
            transformFunction={(item) => item}
            formItemProp="role"
            detailsItemProp="role"
        />
    );
};

export default RolesPage;