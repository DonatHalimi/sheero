import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountLinkStatusIcon, DashboardHeader, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddUserModal from '../../components/Modal/User/AddUserModal';
import EditUserModal from '../../components/Modal/User/EditUserModal';
import UserDetailsDrawer from '../../components/Modal/User/UserDetailsDrawer';
import { getUsers } from '../../store/actions/dashboardActions';

const UsersPage = () => {
    const { users, loadingUsers } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddUserOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [users]);

    const handleSelectUser = (newSelection) => {
        setSelectedUsers(newSelection);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditUserOpen(true);
    };

    const handleEditFromDrawer = (user) => {
        setViewDetailsOpen(false);
        setSelectedUser(user);
        setEditUserOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getUsers());
        setSelectedUsers([]);
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedUser(null);
    };

    const handleBulkDelete = () => {
        if (selectedUsers.length > 0) {
            setDeletionContext({
                endpoint: '/users/delete-bulk',
                data: { ids: selectedUsers },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (user) => {
        setDeletionContext({
            endpoint: `/users/delete/${user._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

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
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        const flattenedUsers = data.map(user => ({
            ...user,
            role: user.role?.name || 'N/A',
        }));

        format === 'excel' ? exportToExcel(flattenedUsers, 'users_data') : exportToJSON(data, 'users_data');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingUsers ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Users"
                            selectedItems={selectedUsers}
                            setAddItemOpen={setAddUserOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="User"
                            exportOptions={exportOptions(users, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={users}
                            selectedItems={selectedUsers}
                            onSelectItem={handleSelectUser}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            containerClassName='user'
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddUserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} onAddSuccess={() => dispatch(getUsers())} />
                <EditUserModal open={editUserOpen} onClose={() => setEditUserOpen(false)} user={selectedUser} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getUsers())} />
                <UserDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} user={selectedUser} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Users' : 'Delete User'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected users?'
                        : 'Are you sure you want to delete this user?'
                    }
                />
            </div>
        </div>
    );
};

export default UsersPage;