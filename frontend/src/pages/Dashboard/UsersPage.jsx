import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Checkbox } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, BrownDeleteOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddUserModal from '../../components/Modal/User/AddUserModal';
import DeleteUserModal from '../../components/Modal/User/DeleteUserModal';
import EditUserModal from '../../components/Modal/User/EditUserModal';
import Pagination from '../../components/Pagination';
import { AuthContext } from '../../context/AuthContext';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [deleteUserOpen, setDeleteUserOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get(`/users/get?page=${currentPage}&limit=${itemsPerPage}`);
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                toast.error('Error fetching users');
                console.error('Error fetching users', error);
            }
        };

        fetchUsers();
    }, [addUserOpen, editUserOpen, deleteUserOpen, currentPage, axiosInstance]);

    const refreshUsers = async () => {
        try {
            const response = await axiosInstance.get(`/users/get?page=${currentPage}&limit=${itemsPerPage}`);
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers((prevSelected) => {
            if (prevSelected.includes(userId)) {
                return prevSelected.filter(id => id !== userId);
            } else {
                return [...prevSelected, userId];
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

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>Users</Typography>
                        <div>
                            <OutlinedBrownButton onClick={() => setAddUserOpen(true)} className='!mr-4'>Add User</OutlinedBrownButton>
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
                    <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <BoldTableCell>
                                        <Checkbox
                                            checked={selectedUsers.length === users.length}
                                            onChange={handleSelectAll}
                                        />
                                    </BoldTableCell>
                                    <BoldTableCell>Username</BoldTableCell>
                                    <BoldTableCell>Email</BoldTableCell>
                                    <BoldTableCell>Password</BoldTableCell>
                                    <BoldTableCell>Role</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users && users.length > 0 ? (
                                    users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedUsers.includes(user._id)}
                                                    onChange={() => handleSelectUser(user._id)}
                                                />
                                            </TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>●●●●●●●●●●</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>
                                                <ActionButton onClick={() => { setSelectedUser(user); setEditUserOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                    <AddUserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} onAddSuccess={refreshUsers} />
                    <EditUserModal open={editUserOpen} onClose={() => setEditUserOpen(false)} user={selectedUser} onEditSuccess={refreshUsers} />
                    <DeleteUserModal open={deleteUserOpen} onClose={() => setDeleteUserOpen(false)} users={selectedUsers.map(id => users.find(user => user._id === id))} onDeleteSuccess={refreshUsers} />
                </div>
            </div>
        </>
    );
};

export default UsersPage;
