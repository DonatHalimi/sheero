import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, DescriptionAdornment, EditExportButtons, formatDate, IdAdornment, PersonAdornment, ReadOnlyTextField, ReturnStatusAdornment } from '../../../assets/CustomComponents';
import { downloadReturnRequestData } from '../../../assets/DataExport';
import { drawerPaperSx } from '../../../assets/sx';

const ReturnRequestDetailsDrawer = ({ open, onClose, returnRequest, onEdit }) => {
    const header = `Return Request from <strong>${returnRequest?.user.firstName} ${returnRequest?.user.lastName} - ${returnRequest?.user.email}</strong> for Order #<strong>${returnRequest?.order}</strong>`;
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
                        <Typography className='!text-lg' dangerouslySetInnerHTML={{ __html: header }} />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Return Request ID"
                                value={returnRequest._id}
                                InputProps={IdAdornment()}
                            />

                            <ReadOnlyTextField
                                label="Order ID"
                                value={returnRequest.order}
                                InputProps={IdAdornment()}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="User"
                            value={user}
                            InputProps={PersonAdornment()}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Product(s)"
                                value={products.map(product => product?.name || 'Unknown Product').join(', ')}
                                multiline
                                rows={4}
                            />
                        </BoxBetween>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Reason"
                                value={returnRequest.reason}
                                InputProps={DescriptionAdornment()}
                            />

                            <ReadOnlyTextField
                                label="Status"
                                value={returnRequest.status}
                                InputProps={ReturnStatusAdornment(returnRequest.status)}
                            />
                        </BoxBetween>

                        {returnRequest.reason === 'Other' && returnRequest.customReason && (
                            <ReadOnlyTextField
                                label="Custom Reason"
                                value={returnRequest.customReason}
                                multiline
                                rows={3}
                                InputProps={DescriptionAdornment()}
                            />
                        )}

                        <ReadOnlyTextField
                            label="Created At"
                            value={formatDate(returnRequest.createdAt)}
                            InputProps={DateAdornment()}
                        />
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