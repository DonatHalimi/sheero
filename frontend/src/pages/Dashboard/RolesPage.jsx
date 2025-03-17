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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
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

    const handleSelectRole = (newSelection) => {
        setSelectedRoles(newSelection);
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

    const handleBulkDelete = () => {
        if (selectedRoles.length > 0) {
            setDeletionContext({
                endpoint: '/roles/delete-bulk',
                data: { ids: selectedRoles },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (role) => {
        setDeletionContext({
            endpoint: `/roles/delete/${role._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        format === 'excel' ? exportToExcel(data, 'roles_data') : exportToJSON(data, 'roles_data');
    };

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
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Role"
                            exportOptions={exportOptions(roles, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={roles}
                            selectedItems={selectedRoles}
                            onSelectItem={handleSelectRole}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddRoleModal open={addRoleOpen} onClose={() => setAddRoleOpen(false)} onAddSuccess={() => dispatch(getRoles())} />
                <EditRoleModal open={editRoleOpen} onClose={() => setEditRoleOpen(false)} role={selectedRole} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getRoles())} />
                <RoleDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} role={selectedRole} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Roles' : 'Delete Role'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected roles?'
                        : 'Are you sure you want to delete this role?'
                    }
                />
            </div>
        </div>
    );
};

export default RolesPage;