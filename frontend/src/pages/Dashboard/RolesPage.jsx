import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader } from '../../assets/CustomComponents.jsx';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal.jsx';
import AddRoleModal from '../../components/Modal/Role/AddRoleModal.jsx';
import EditRoleModal from '../../components/Modal/Role/EditRoleModal.jsx';
import { getRoles } from '../../store/actions/dashboardActions.js';

const RolesPage = () => {
    const { roles } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [addRoleOpen, setAddRoleOpen] = useState(false);
    const [editRoleOpen, setEditRoleOpen] = useState(false);
    const [deleteRoleOpen, setDeleteRoleOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);

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
        { key: 'name', label: 'Name' },
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

                <AddRoleModal open={addRoleOpen} onClose={() => setAddRoleOpen(false)} onAddSuccess={() => dispatch(getRoles())} />
                <EditRoleModal open={editRoleOpen} onClose={() => setEditRoleOpen(false)} role={selectedRole} onEditSuccess={() => dispatch(getRoles())} />
                <DeleteModal
                    open={deleteRoleOpen}
                    onClose={() => setDeleteRoleOpen(false)}
                    items={selectedRoles.map(id => roles.find(role => role._id === id)).filter(role => role)}
                    onDeleteSuccess={() => dispatch(getRoles())}
                    endpoint="/roles/delete-bulk"
                    title="Delete Roles"
                    message="Are you sure you want to delete the selected roles?"
                />
            </div>
        </div>
    );
};

export default RolesPage;