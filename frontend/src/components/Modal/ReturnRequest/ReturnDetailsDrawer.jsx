import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, downloadReturnRequestData, EditExportButtons, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { drawerPaperSx } from '../../../assets/sx';

const ReturnRequestDetailsDrawer = ({ open, onClose, returnRequest, onEdit }) => {
    const header = `Return Request from ${returnRequest?.user.firstName} ${returnRequest?.user.lastName} - ${returnRequest?.user.email} for Order #${returnRequest?.order}`;
    const user = `${returnRequest?.user.firstName} ${returnRequest?.user.lastName} - ${returnRequest?.user.email}`;

    const products = typeof returnRequest?.products === 'string'
        ? returnRequest.products.split(', ').map((productName, index) => ({
            _id: `unknown - ${index} `,
            name: productName.trim(),
        })) : Array.isArray(returnRequest?.products)
            ? returnRequest.products
            : [];

    const handleEditClick = () => {
        onClose();
        onEdit(returnRequest);
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
                {returnRequest ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {header}
                        </Typography>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Return Request ID"
                                value={returnRequest._id}
                            />

                            <ReadOnlyTextField
                                label="Order ID"
                                value={returnRequest.order}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="User"
                            value={user}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Product(s)"
                                value={products.map(product => product?.name || 'Unknown Product').join(', ')}
                                multiline
                                rows={4}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Reason"
                            value={returnRequest.reason}
                        />

                        <BoxBetween>
                            {returnRequest.reason === 'Other' && returnRequest.customReason && (
                                <ReadOnlyTextField
                                    label="Custom Reason"
                                    value={returnRequest.customReason}
                                />
                            )}
                            <ReadOnlyTextField
                                label="Status"
                                value={returnRequest.status}
                            />
                        </BoxBetween>

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadReturnRequestData(returnRequest)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching returnRequest" />
                )}
            </Box>
        </Drawer>
    );
};

export default ReturnRequestDetailsDrawer;