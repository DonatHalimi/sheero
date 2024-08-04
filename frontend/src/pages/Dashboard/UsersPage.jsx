import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddUserModal from '../../components/Modal/User/AddUserModal';
import DeleteUserModal from '../../components/Modal/User/DeleteUserModal';
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
    const itemsPerPage = 6;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchUsers();
    }, [addUserOpen, editUserOpen, deleteUserOpen, currentPage, axiosInstance]);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get(`/users/get?page=${currentPage}&limit=${itemsPerPage}`);
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users', error);
        }
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

    const pageCount = Math.ceil(users.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = pageCount && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return users.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
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
                                {getCurrentPageItems().length > 0 ? (
                                    getCurrentPageItems().map((user) => (
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
                    <AddUserModal open={addUserOpen} onClose={() => setAddUserOpen(false)} onAddSuccess={fetchUsers} />
                    <EditUserModal open={editUserOpen} onClose={() => setEditUserOpen(false)} user={selectedUser} onEditSuccess={fetchUsers} />
                    <DeleteUserModal open={deleteUserOpen} onClose={() => setDeleteUserOpen(false)} users={selectedUsers.map(id => users.find(user => user._id === id))} onDeleteSuccess={fetchUsers} />

                    {users.length > 0 && paginationEnabled && (
                        <div className="w-full flex justify-start mt-6 mb-24">
                            <ReactPaginate
                                pageCount={pageCount}
                                pageRangeDisplayed={2}
                                marginPagesDisplayed={1}
                                onPageChange={handlePageClick}
                                containerClassName="inline-flex -space-x-px text-sm"
                                activeClassName="text-stone-600 bg-stone-500 border-blue-500"
                                previousLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-e-0 border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isPreviousDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                                nextLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isNextDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                                disabledClassName="text-gray-50 cursor-not-allowed"
                                activeLinkClassName="text-stone-600 font-extrabold"
                                previousLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 hover:text-gray-700">Previous</span>}
                                nextLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 hover:text-gray-700">Next</span>}
                                breakLabel={<span className="flex items-center justify-center px-4 h-10 text-gray-500 bg-white border border-gray-300">...</span>}
                                pageClassName="flex items-center justify-center px-1 h-10 text-gray-500 border border-gray-300 cursor-pointer bg-white"
                                pageLinkClassName="flex items-center justify-center px-3 h-10 text-gray-500 cursor-pointer"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UsersPage;