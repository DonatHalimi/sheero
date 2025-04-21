import { Box, Drawer } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, DetailsTitle, formatDate, IdAdornment, PersonAdornment, ReadOnlyTextField } from '../../../../assets/CustomComponents';
import { downloadRoleData } from '../../../../assets/DataExport';
import { drawerPaperSx } from '../../../../assets/sx';

const RoleDetailsDrawer = ({ open, onClose, role, onEdit, onDelete }) => {
    const handleEdit = () => {
        onClose();
        onEdit(role);
    };

    const handleExport = () => {
        downloadRoleData(role);
    };

    const handleDelete = () => {
        onClose();
        onDelete(role);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={drawerPaperSx}
            sx={{ zIndex: 9999 }}
        >
            <CloseButton onClose={onClose} />
            <Box className="flex flex-col w-full mt-4 gap-4">
                {role ? (
                    <>
                        <DetailsTitle
                            entity={role}
                            entityName="Role"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

                        <ReadOnlyTextField
                            label="Role ID"
                            value={role._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={role.name}
                        />

                        <ReadOnlyTextField
                            label="Description"
                            value={role.description}
                            multiline
                            rows={4}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(role.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(role.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>

                        {role.createdBy && (
                            <ReadOnlyTextField
                                label="Created By"
                                value={`${role.createdBy.firstName} ${role.createdBy.lastName} - ${role.createdBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

                        {role.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${role.updatedBy.firstName} ${role.updatedBy.lastName} - ${role.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching role" />
                )}
            </Box>
        </Drawer>
    );
};

export default RoleDetailsDrawer;