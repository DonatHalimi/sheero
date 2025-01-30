import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents.jsx';
import { exportToExcel, exportToJSON } from '../../assets/DataExport.jsx';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal.jsx';
import AddRoleModal from '../../components/Modal/Role/AddRoleModal.jsx';
import EditRoleModal from '../../components/Modal/Role/EditRoleModal.jsx';
import RoleDetailsDrawer from '../../components/Modal/Role/RoleDetailsDrawer.jsx';
import { getRoles } from '../../store/actions/dashboardActions.js';

const RolesPage = () => {
    const { roles, loadingRoles } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [addRoleOpen, setAddRoleOpen] = useState(false);
    const [editRoleOpen, setEditRoleOpen] = useState(false);
    const [deleteRoleOpen, setDeleteRoleOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddRoleOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [roles]);

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

    const handleEditFromDrawer = (role) => {
        setViewDetailsOpen(false);
        setSelectedRole(role);
        setEditRoleOpen(true);
    };

    const getSelectedRoles = () => {
        return selectedRoles
            .map((id) => roles.find((role) => role._id === id))
            .filter((role) => role);
    };

    const handleDeleteSuccess = () => {
        dispatch(getRoles());
        setSelectedRoles([]);
    };

    const handleViewDetails = (role) => {
        setSelectedRole(role);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedRole(null);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        format === 'excel' ? exportToExcel(data, 'roles_data') : exportToJSON(data, 'roles_data');
    }

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingRoles ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Roles"
                            selectedItems={selectedRoles}
                            setAddItemOpen={setAddRoleOpen}
                            setDeleteItemOpen={setDeleteRoleOpen}
                            itemName="Role"
                            exportOptions={exportOptions(roles, handleExport)}
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
                            onViewDetails={handleViewDetails}
                        />
                    </>
                )}

                <AddRoleModal open={addRoleOpen} onClose={() => setAddRoleOpen(false)} onAddSuccess={() => dispatch(getRoles())} />
                <EditRoleModal open={editRoleOpen} onClose={() => setEditRoleOpen(false)} role={selectedRole} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getRoles())} />
                <RoleDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} role={selectedRole} onEdit={handleEditFromDrawer} />
                <DeleteModal
                    open={deleteRoleOpen}
                    onClose={() => setDeleteRoleOpen(false)}
                    items={getSelectedRoles()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/roles/delete-bulk"
                    title="Delete Roles"
                    message="Are you sure you want to delete the selected roles?"
                />
            </div>
        </div>
    );
};

export default RolesPage;