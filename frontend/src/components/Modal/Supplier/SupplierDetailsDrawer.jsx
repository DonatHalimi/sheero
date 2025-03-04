import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, EditExportButtons, IdAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
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