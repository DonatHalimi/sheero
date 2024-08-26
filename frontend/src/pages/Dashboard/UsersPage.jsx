import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddUserModal from '../../components/Modal/User/AddUserModal';
import EditUserModal from '../../components/Modal/User/EditUserModal';
import { AuthContext } from '../../context/AuthContext';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [deleteUserOpen, setDeleteUserOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchUsers();
    }, [addUserOpen, editUserOpen, deleteUserOpen, currentPage, axiosInstance]);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/users/get');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

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

    const columns = [
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'password', label: 'Password' },
        { key: 'role', label: 'Role' },
        { key: 'actions', label: 'Actions' }
    ];

    const renderActionButtons = (user) => (
        <ActionButton onClick={() => { setSelectedUser(user); setEditUserOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>Users</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddUserOpen(true)} className='!mr-4'>
                    Add User
                </OutlinedBrownButton>
                {selectedUsers.length > 0 && (
                    <OutlinedBrownButton
                        onClick={() => setDeleteUserOpen(true)}
                        disabled={selectedUsers.length === 0}
                    >
                        {selectedUsers.length > 1 ? 'Delete Selected Users' : 'Delete User'}
                    </OutlinedBrownButton>
                )}
            </div>
        </div>
    );

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardTable
                    columns={columns}
                    data={users}
                    selectedItems={selectedUsers}
                    onSelectItem={handleSelectUser}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                    containerClassName='user'
                />

                <AddUserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} onAddSuccess={fetchUsers} />
                <EditUserModal open={editUserOpen} onClose={() => setEditUserOpen(false)} user={selectedUser} onEditSuccess={fetchUsers} />
                <DeleteModal
                    open={deleteUserOpen}
                    onClose={() => setDeleteUserOpen(false)}
                    items={selectedUsers.map(id => users.find(user => user._id === id)).filter(user => user)}
                    onDeleteSuccess={fetchUsers}
                    endpoint="/users/delete-bulk"
                    title="Delete Users"
                    message="Are you sure you want to delete the selected users?"
                />
            </div>
        </div>
    );
};

export default UsersPage;