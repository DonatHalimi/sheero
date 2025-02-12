import { Download } from '@mui/icons-material';
import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { CloseButton, OutlinedBrownButton, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadSubscriptionData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';
import { getImageUrl } from '../../../utils/config';

const SubscriptionDetailsDrawer = ({ open, onClose, subscription }) => {
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
                        <Typography className=' !text-lg'>
                            <strong>{subscription.email}</strong>'s Restock Subscription Details for <strong>{subscription.productId.name}</strong>
                        </Typography>

                        <ReadOnlyTextField
                            label="Restock Subscription Id"
                            value={subscription._id}
                        />

                        <ReadOnlyTextField
                            label="User Email"
                            value={subscription.email}
                        />

                        <ReadOnlyTextField
                            label="Product Id"
                            value={subscription.productId._id}
                        />

                        <Box className="flex flex-col items-center mt-3 mb-3">
                            <img
                                src={getImageUrl(subscription.productId.image)}
                                alt={`${subscription.productId.name} image`}
                                className='w-1/3'
                            />
                        </Box>

                        <ReadOnlyTextField
                            label="Product Name"
                            value={subscription.productId.name}
                            multiline
                            rows={3}
                        />

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