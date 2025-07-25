import { Box, Drawer, useTheme } from '@mui/material';
import { paperPropsSx } from '../../../../assets/sx';
import { DateAdornment, IdAdornment, PersonAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate } from '../../../custom/utils';
import { downloadRoleData } from '../../../Product/Utils/DataExport';

const RoleDetailsDrawer = ({ open, onClose, role, onEdit, onDelete }) => {
    const theme = useTheme();

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
            PaperProps={paperPropsSx(theme)}
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