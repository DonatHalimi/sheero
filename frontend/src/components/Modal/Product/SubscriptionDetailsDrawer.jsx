import { Download } from '@mui/icons-material';
import { Box, Chip, Drawer, Typography, useTheme } from '@mui/material';
import React from 'react';
import { CloseButton, DrawerTypography, IdAdornment, OutlinedBrownButton, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadSubscriptionData } from '../../../assets/DataExport';
import { chipSx, drawerPaperSx } from '../../../assets/sx';
import { getImageUrl } from '../../../utils/config';

const SubscriptionDetailsDrawer = ({ open, onClose, subscription }) => {
    const theme = useTheme();

    const header = `Restock Subscription from <strong>${subscription?.email}</strong> for <strong>${subscription?.productId.name}</strong>`;

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
                {subscription ? (
                    <>
                        <Typography dangerouslySetInnerHTML={{ __html: header }} className='!text-lg' />

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
                                                onClick={() => window.open(`/product/${subscription.productId._id}`, '_blank')}
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

                        <OutlinedBrownButton
                            variant="contained"
                            startIcon={<Download />}
                            onClick={() => downloadSubscriptionData(subscription)}
                        >
                            Export as JSON
                        </OutlinedBrownButton>
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching subscription" />
                )}
            </Box>
        </Drawer>
    );
};

export default SubscriptionDetailsDrawer;