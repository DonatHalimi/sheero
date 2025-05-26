import { Check, Clear } from '@mui/icons-material';
import { AccountLinkStatusIcon } from '../../components/custom/Icons';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import UserDetailsDrawer from '../../components/Dashboard/Modal/User/UserDetailsDrawer';
import UserForm from '../../components/Dashboard/Modal/User/UserForm';
import { getUsers } from '../../store/actions/dashboardActions';

const UsersPage = () => {
    const itemsSelector = (state) => state.dashboard.users;
    const loadingSelector = (state) => state.dashboard.loadingUsers;

    const columns = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'email', label: 'Email' },
        { key: 'password', label: 'Password' },
        { key: 'role', label: 'Role', render: (user) => user.role.name },
        {
            key: 'googleId',
            label: 'Linked With Google',
            render: (user) => <AccountLinkStatusIcon hasId={user.googleId} platform="Google" />
        },
        {
            key: 'facebookId',
            label: 'Linked With Facebook',
            render: (user) => <AccountLinkStatusIcon hasId={user.facebookId} platform="Facebook" />
        },
        {
            key: 'twoFactorEnabled',
            label: '2FA',
            render: (user) => (user.twoFactorEnabled ? <Check className='text-green-600' /> : <Clear className='text-red-600' />)
        },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (user) => ({
        ...user,
        role: user.role?.name || 'N/A',
    });

    return (
        <DashboardPage
            title="Users"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getUsers}
            entityName="user"
            FormComponent={UserForm}
            DetailsDrawerComponent={UserDetailsDrawer}
            transformFunction={handleExport}
            formItemProp="user"
            detailsItemProp="user"
        />
    );
};

export default UsersPage;