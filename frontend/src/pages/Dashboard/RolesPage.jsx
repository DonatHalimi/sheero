import React, { useContext, useEffect, useState } from 'react';
import { DashboardHeader } from '../../assets/CustomComponents.jsx';
import useAxios from '../../axiosInstance.js';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddRoleModal from '../../components/Modal/Role/AddRoleModal.jsx';
import EditRoleModal from '../../components/Modal/Role/EditRoleModal.jsx';
import DeleteModal from '../../components/Modal/DeleteModal.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

const RolesPage = () => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [addRoleOpen, setAddRoleOpen] = useState(false);
    const [editRoleOpen, setEditRoleOpen] = useState(false);
    const [deleteRoleOpen, setDeleteRoleOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchRoles();
    }, [addRoleOpen, editRoleOpen, deleteRoleOpen, axiosInstance]);

    const fetchRoles = async () => {
        try {
            const response = await axiosInstance.get('/roles/get');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles', error);
        }
    };

    const handleSelectRole = (roleId) => {
        const id = Array.isArray(roleId) ? roleId[0] : roleId;

        setSelectedRoles((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedRoles(e.target.checked ? roles.map(role => role._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (role) => {
        setSelectedRole(role);
        setEditRoleOpen(true);
    };

    const columns = [
        { key: 'name', label: 'Role Name' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="Roles"
                    selectedItems={selectedRoles}
                    setAddItemOpen={setAddRoleOpen}
                    setDeleteItemOpen={setDeleteRoleOpen}
                    itemName="Role"
                />

                <DashboardTable
                    columns={columns}
                    data={roles}
                    selectedItems={selectedRoles}
                    onSelectItem={handleSelectRole}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    onEdit={handleEdit}
                />

                <AddRoleModal 
                    open={addRoleOpen} 
                    onClose={() => setAddRoleOpen(false)} 
                    onAddSuccess={fetchRoles} 
                />
                <EditRoleModal 
                    open={editRoleOpen} 
                    onClose={() => setEditRoleOpen(false)} 
                    role={selectedRole} 
                    onEditSuccess={fetchRoles} 
                />
                <DeleteModal
                    open={deleteRoleOpen}
                    onClose={() => setDeleteRoleOpen(false)}
                    items={selectedRoles.map(id => roles.find(role => role._id === id)).filter(role => role)}
                    onDeleteSuccess={fetchRoles}
                    endpoint="/roles/delete-bulk"
                    title="Delete Roles"
                    message="Are you sure you want to delete the selected roles?"
                />
            </div>
        </div>
    );
};

export default RolesPage;