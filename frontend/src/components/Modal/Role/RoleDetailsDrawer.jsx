import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { CloseButton, EditExportButtons, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadRoleData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';

const RoleDetailsDrawer = ({ open, onClose, role, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(role);
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
                        <Typography className='!font-bold !text-lg'>
                            {role.name}'s Details
                        </Typography>

                        <ReadOnlyTextField
                            label="Role ID"
                            value={role._id}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={role.name}
                        />

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadRoleData(role)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching role" />
                )}
            </Box>
        </Drawer>
    );
};

export default RoleDetailsDrawer;