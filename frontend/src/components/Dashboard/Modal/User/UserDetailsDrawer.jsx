import { Check, Clear } from '@mui/icons-material';
import { Box, Chip, Drawer, Typography, useTheme } from '@mui/material';
import { paperPropsSx } from '../../../../assets/sx';
import { IdAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { AccountLinkStatus, BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDateTime } from '../../../custom/utils';
import { downloadUserDetails } from '../../../Product/Utils/DataExport';

const UserDetailsDrawer = ({ open, onClose, user, onEdit, onDelete }) => {
    const theme = useTheme();

    const handleEdit = () => {
        onClose();
        onEdit(user);
    };

    const handleExport = () => {
        downloadUserDetails(user);
    };

    const handleDelete = () => {
        onClose();
        onDelete(user);
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
                {user ? (
                    <>
                        <DetailsTitle
                            entity={user}
                            entityName="User"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

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

                        <BoxBetween>
                            <AccountLinkStatus hasId={user.googleId} platform="Google" />
                            <AccountLinkStatus hasId={user.facebookId} platform="Facebook" />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Two-Factor Authentication"
                            value={user.twoFactorEnabled ? "Enabled" : "Not Enabled"}
                            InputProps={{
                                startAdornment: user.twoFactorEnabled ? (
                                    <Check className="text-green-600 mr-2" />
                                ) : (
                                    <Clear className="text-red-600 mr-2" />
                                )
                            }}
                        />

                        {user.twoFactorEnabled && (
                            <Box className="flex flex-col">
                                <Typography className="!text-sm !font-medium !mb-[6px]">Two-Factor Methods</Typography>
                                <Box
                                    sx={{ display: 'flex', gap: 0.8, whiteSpace: 'nowrap' }}
                                    className="border border-gray-300 rounded-md px-2 py-[10px] text-sm overflow-x-auto"
                                >
                                    {user.twoFactorMethods.length ? (
                                        user.twoFactorMethods.map((method, index) => (
                                            <Chip
                                                key={index}
                                                label={method}
                                                variant="filled"
                                                size="small"
                                                color="primary"
                                                className="!text-xs !p-2"
                                            />
                                        ))
                                    ) : (
                                        <Typography className="text-stone-500 !text-sm">None</Typography>
                                    )}
                                </Box>
                            </Box>
                        )}

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Login Count"
                                value={user.loginCount}
                            />

                            <ReadOnlyTextField
                                label="Last Login"
                                value={formatDateTime(user.lastLogin)}
                            />
                        </BoxBetween>

                        <Box className="flex flex-col items-center mt-3 mb-3 rounded-full">
                            <img
                                src={user.profilePicture}
                                alt={`${user.firstName} ${user.lastName}'s profile`}
                                className='w-1/4 rounded-full mb-2'
                            />
                        </Box>
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching user" />
                )}
            </Box>
        </Drawer>
    );
};

export default UserDetailsDrawer;