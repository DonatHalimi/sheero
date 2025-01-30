import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, EditExportButtons, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadAddressData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';

const AddressDetailsDrawer = ({ open, onClose, address, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(address);
    }

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
                {address ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {address.user.firstName} {address.user.lastName}'s Address
                        </Typography>
                        <ReadOnlyTextField
                            label="Address ID"
                            value={address._id}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Name"
                                value={address.user.firstName}
                            />
                            <ReadOnlyTextField
                                label="First Name"
                                value={address.user.lastName}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="User Email"
                            value={address.user.email}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Country"
                                value={address.country.name}
                            />

                            <ReadOnlyTextField
                                label="City (Zip Code)"
                                value={`${address.city.name} (${address.city.zipCode})`}
                            />
                        </BoxBetween>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Street"
                                value={address.street}
                            />

                            <ReadOnlyTextField
                                label="Phone"
                                value={address.phoneNumber}
                            />
                        </BoxBetween>

                        {address.comment && (
                            <ReadOnlyTextField
                                label="Comment"
                                value={address.comment || 'N/A'}
                                multiline
                                rows={4}
                            />
                        )}

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadAddressData(address)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching address" />
                )}
            </Box>
        </Drawer>
    );
};

export default AddressDetailsDrawer;