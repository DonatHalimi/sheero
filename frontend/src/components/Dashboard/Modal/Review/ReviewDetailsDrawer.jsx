import { Box, Chip, Drawer, Typography, useTheme } from '@mui/material';
import { chipSx, drawerPaperSx } from '../../../../assets/sx';
import { getImageUrl } from '../../../../utils/config';
import { DateAdornment, IdAdornment, PersonAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, DrawerTypography, ReadOnlyTextField } from '../../../custom/MUI';
import { RatingStars } from '../../../custom/Product';
import { formatDate } from '../../../custom/utils';
import { downloadReviewData } from '../../../Product/Utils/DataExport';

const ReviewDetailsDrawer = ({ open, onClose, review, onEdit, onDelete }) => {
    const theme = useTheme();

    const user = `${review?.user.firstName} ${review?.user.lastName} - ${review?.user.email}`;

    const handleEdit = () => {
        onClose();
        onEdit(review);
    };

    const handleExport = () => {
        downloadReviewData(review);
    };

    const handleDelete = () => {
        onClose();
        onDelete(review);
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
                {review ? (
                    <>
                        <DetailsTitle
                            entity={review}
                            entityName="Review"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

                        <ReadOnlyTextField
                            label="Review ID"
                            value={review._id}
                            InputProps={IdAdornment()}
                        />
                        <ReadOnlyTextField
                            label="User"
                            value={user}
                            InputProps={PersonAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Product ID"
                            value={review.product._id}
                            InputProps={IdAdornment()}
                        />

                        <Box>
                            <DrawerTypography theme={theme}>
                                Product
                            </DrawerTypography>
                            <Box sx={chipSx}>
                                <Chip
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box
                                                onClick={() => window.open(`/${review.product?.slug}`, '_blank')}
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    src={getImageUrl(review.product?.image)}
                                                    alt={review.product?.name}
                                                    className="w-10 h-10 object-contain"
                                                />
                                                <Typography variant="body2" className="!font-semibold hover:underline">
                                                    {`${review.product?.name}`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                    variant="outlined"
                                    className="w-full !justify-start"
                                />
                            </Box>
                        </Box>

                        <Box sx={chipSx} className="flex flex-col gap-1">
                            <DrawerTypography theme={theme}>
                                Rating
                            </DrawerTypography>
                            <Chip
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <div className='flex items-center relative text-xl p-1'>
                                            <RatingStars rating={review.rating} />
                                        </div>
                                    </Box>
                                }
                                variant="outlined"
                                className="w-full !justify-start"
                            />
                        </Box>

                        <ReadOnlyTextField
                            label="Title"
                            value={review.title}
                            multiline
                            rows={3}
                        />

                        <ReadOnlyTextField
                            label="Comment"
                            value={review.comment}
                            multiline
                            rows={4}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Created At"
                                value={formatDate(review.createdAt)}
                                InputProps={DateAdornment()}
                            />
                            <ReadOnlyTextField
                                label="Updated At"
                                value={formatDate(review.updatedAt)}
                                InputProps={DateAdornment()}
                            />
                        </BoxBetween>
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching review" />
                )}
            </Box>
        </Drawer>
    );
};

export default ReviewDetailsDrawer;