import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, EditExportButtons, formatDate, IdAdornment, PersonAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadSupplierData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';

const SupplierDetailsDrawer = ({ open, onClose, supplier, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(supplier);
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
                {supplier ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {supplier.name}'s Details
                        </Typography>

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

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadSupplierData(supplier)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching supplier" />
                )}
            </Box>
        </Drawer>
    );
};

export default SupplierDetailsDrawer;