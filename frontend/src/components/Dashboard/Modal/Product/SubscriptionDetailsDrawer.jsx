import { Box, Chip, Drawer, Typography, useTheme } from '@mui/material';
import { chipSx, paperPropsSx } from '../../../../assets/sx';
import { getImageUrl } from '../../../../utils/config/config';
import { IdAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { CloseButton, DrawerTypography, ReadOnlyTextField } from '../../../custom/MUI';
import { downloadSubscriptionData } from '../../../Product/Utils/DataExport';

const SubscriptionDetailsDrawer = ({ open, onClose, subscription, onDelete }) => {
    const theme = useTheme();

    const handleExport = () => {
        downloadSubscriptionData(subscription);
    };

    const handleDelete = () => {
        onClose();
        onDelete(subscription);
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
                {subscription ? (
                    <>
                        <DetailsTitle
                            entity={subscription}
                            entityName="Restock Subscription"
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                            showEditButton={false}
                        />

                        <ReadOnlyTextField
                            label="Restock Subscription ID"
                            value={subscription._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="User Email"
                            value={subscription.email}
                        />

                        <ReadOnlyTextField
                            label="Product ID"
                            value={subscription.productId._id}
                            InputProps={IdAdornment()}
                        />

                        <Box>
                            <DrawerTypography theme={theme}>Product</DrawerTypography>
                            <Box sx={chipSx}>
                                <Chip
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box
                                                onClick={() => window.open(`/${subscription.productId.slug}`, '_blank')}
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    src={getImageUrl(subscription.productId.image)}
                                                    alt={subscription.productId.name}
                                                    className="w-10 h-10 object-contain"
                                                />
                                                <Typography variant="body2" className="!font-semibold hover:underline">
                                                    {`${subscription.productId.name}`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                    variant="outlined"
                                    className="w-full !justify-start"
                                />
                            </Box>
                        </Box>

                        <ReadOnlyTextField
                            label="Product Inventory"
                            value={subscription.productId.inventory === 0 ? '0' : subscription.productId.inventory}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching subscription" />
                )}
            </Box>
        </Drawer >
    );
};

export default SubscriptionDetailsDrawer;