import { Box, Drawer, useTheme } from '@mui/material';
import { paperPropsSx } from '../../../../assets/sx';
import { DateAdornment, IdAdornment, PersonAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate } from '../../../custom/utils';
import { downloadSupplierData } from '../../../Product/Utils/DataExport';

const SupplierDetailsDrawer = ({ open, onClose, supplier, onEdit, onDelete }) => {
    const theme = useTheme();

    const handleEdit = () => {
        onClose();
        onEdit(supplier);
    };

    const handleExport = () => {
        downloadSupplierData(supplier);
    };

    const handleDelete = () => {
        onClose();
        onDelete(supplier);
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
                {supplier ? (
                    <>
                        <DetailsTitle
                            entity={supplier}
                            entityName="Supplier"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

                        <ReadOnlyTextField
                            label="Supplier ID"
                            value={supplier._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={supplier.name}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Email"
                                value={supplier.contactInfo.email}
                            />
                            <ReadOnlyTextField
                                label="Phone Number"
                                value={supplier.contactInfo.phoneNumber}
                            />
                        </BoxBetween>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(supplier.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(supplier.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>

                        {supplier.createdBy && (
                            <ReadOnlyTextField
                                label="Created By"
                                value={`${supplier.createdBy.firstName} ${supplier.createdBy.lastName} - ${supplier.createdBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}

                        {supplier.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${supplier.updatedBy.firstName} ${supplier.updatedBy.lastName} - ${supplier.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching supplier" />
                )}
            </Box>
        </Drawer>
    );
};

export default SupplierDetailsDrawer;