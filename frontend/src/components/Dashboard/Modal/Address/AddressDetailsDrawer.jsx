import { Box, Drawer, useTheme } from '@mui/material';
import { paperPropsSx } from '../../../../assets/sx';
import { IdAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { downloadAddressData } from '../../../Product/Utils/DataExport';

const AddressDetailsDrawer = ({ open, onClose, address, onEdit, onDelete }) => {
    const theme = useTheme();

    const handleEdit = () => {
        onClose();
        onEdit(address);
    };

    const handleExport = () => {
        downloadAddressData(address);
    };

    const handleDelete = () => {
        onClose();
        onDelete(address);
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
                {address ? (
                    <>
                        <DetailsTitle
                            entity={address}
                            entityName="Address"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

                        <ReadOnlyTextField
                            label="Address ID"
                            value={address._id}
                            InputProps={IdAdornment()}
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
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching address" />
                )}
            </Box>
        </Drawer>
    );
};

export default AddressDetailsDrawer;