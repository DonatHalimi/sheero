import { Box, Drawer, Typography, useTheme } from '@mui/material';
import { paperPropsSx } from '../../../../assets/sx';
import { DateAdornment, DescriptionAdornment, IdAdornment, PersonAdornment, ReturnStatusAdornment } from '../../../custom/Adornments';
import { CollapsibleProductList, TitleActions } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate } from '../../../custom/utils';
import { downloadReturnRequestData } from '../../../Product/Utils/DataExport';

const ReturnRequestDetailsDrawer = ({ open, onClose, returnRequest, onEdit, onDelete }) => {
    const theme = useTheme();

    const header = `Return Request for Order #<strong>${returnRequest?.order}</strong>`;
    const user = `${returnRequest?.user.firstName} ${returnRequest?.user.lastName} - ${returnRequest?.user.email}`;

    const products = typeof returnRequest?.products === 'string'
        ? returnRequest.products.split(', ').map((productName, index) => ({
            _id: `unknown - ${index} `,
            name: productName.trim(),
        })) : Array.isArray(returnRequest?.products)
            ? returnRequest.products
            : [];

    const transformedProducts = products.map(product => ({ product }));

    const productLabel = products.length === 1 ? 'Product' : 'Products';

    const handleEdit = () => {
        onClose();
        onEdit(returnRequest);
    };

    const handleDelete = () => {
        onClose();
        onDelete(returnRequest);
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
                {returnRequest ? (
                    <>
                        <div className='flex items-center justify-left gap-4'>
                            <Typography className='!text-lg' dangerouslySetInnerHTML={{ __html: header }} />
                            <TitleActions
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onExport={() => downloadReturnRequestData(returnRequest)}
                            />
                        </div>

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

                        <CollapsibleProductList
                            products={transformedProducts}
                            label={productLabel}
                            isOrder={false}
                        />

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

                        {returnRequest.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${returnRequest.updatedBy.firstName} ${returnRequest.updatedBy.lastName} - ${returnRequest.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching returnRequest" />
                )}
            </Box>
        </Drawer>
    );
};

export default ReturnRequestDetailsDrawer;