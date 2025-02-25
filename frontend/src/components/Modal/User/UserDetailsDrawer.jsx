import { Box, Chip, Drawer, Typography } from '@mui/material';
import React from 'react';
import { AccountLinkStatus, BoxBetween, CloseButton, EditExportButtons, IdAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadUserDetails } from '../../../assets/DataExport';
import { chipSx, drawerPaperSx } from '../../../assets/sx';

const UserDetailsDrawer = ({ open, onClose, user, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(user);
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
                {user ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {user.firstName} {user.lastName}'s Details
                        </Typography>

                        <ReadOnlyTextField
                            label="User ID"
                            value={user._id}
                            InputProps={IdAdornment()}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="First Name"
                                value={user.firstName}
                            />

                            <ReadOnlyTextField
                                label="Last Name"
                                value={user.lastName}
                            />
                        </BoxBetween>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Email"
                                value={user.email}
                            />
                            <ReadOnlyTextField
                                label="Role"
                                value={user.role.name}
                            />
                        </BoxBetween>

                        <Box>
                            <Box sx={chipSx} className='mb-2'>
                                <Chip
                                    label={
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                        >
                                            <AccountLinkStatus hasId={user.googleId} platform="Google" />
                                        </Box>
                                    }
                                    variant="outlined"
                                    className="w-full !justify-start !pt-1 !pb-1"
                                />
                            </Box>
                            <Box sx={chipSx}>
                                <Chip
                                    label={
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                        >
                                            <AccountLinkStatus hasId={user.facebookId} platform="Facebook" />
                                        </Box>
                                    }
                                    variant="outlined"
                                    className="w-full !justify-start !pt-1 !pb-1"
                                />
                            </Box>
                        </Box>

                        <Box className="flex flex-col items-center mt-3 mb-3 rounded-full">
                            <img
                                src={user.profilePicture}
                                alt={`${user.firstName} ${user.lastName}'s profile`}
                                className='w-1/4 rounded-full mb-2'
                            />
                        </Box>

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadUserDetails(user)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching user" />
                )}
            </Box>
        </Drawer>
    );
};

export default UserDetailsDrawer;

