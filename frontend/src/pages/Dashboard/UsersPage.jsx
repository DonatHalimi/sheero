import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountLinkStatusIcon, DashboardHeader, LoadingDataGrid } from '../../assets/CustomComponents';
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
    const [deleteUserOpen, setDeleteUserOpen] = useState(false);
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

    const handleSelectUser = (userId) => {
        const id = Array.isArray(userId) ? userId[0] : userId;

        setSelectedUsers((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(user => user._id));
        } else {
            setSelectedUsers([]);
        }
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

    const getSelectedUsers = () => {
        return selectedUsers
            .map((id) => users.find((user) => user._id === id))
            .filter((user) => user);
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
                            setDeleteItemOpen={setDeleteUserOpen}
                            itemName="User"
                        />

                        <DashboardTable
                            columns={columns}
                            data={users}
                            selectedItems={selectedUsers}
                            onSelectItem={handleSelectUser}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            containerClassName='user'
                            onViewDetails={handleViewDetails}
                        />
                    </>
                )}

                <AddUserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} onAddSuccess={() => dispatch(getUsers())} />
                <EditUserModal open={editUserOpen} onClose={() => setEditUserOpen(false)} user={selectedUser} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getUsers())} />
                <UserDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} user={selectedUser} onEdit={handleEditFromDrawer} />
                <DeleteModal
                    open={deleteUserOpen}
                    onClose={() => setDeleteUserOpen(false)}
                    items={getSelectedUsers()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/users/delete-bulk"
                    title="Delete Users"
                    message="Are you sure you want to delete the selected users?"
                />
            </div>
        </div>
    );
};

export default UsersPage;