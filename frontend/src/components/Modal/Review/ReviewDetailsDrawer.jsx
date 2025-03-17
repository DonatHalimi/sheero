import { Box, Chip, Drawer, Typography, useTheme } from '@mui/material';
import React from 'react';
import { CloseButton, DrawerTypography, EditExportButtons, IdAdornment, PersonAdornment, RatingStars, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadReviewData } from '../../../assets/DataExport';
import { chipSx, drawerPaperSx } from '../../../assets/sx';
import { getImageUrl } from '../../../utils/config';

const ReviewDetailsDrawer = ({ open, onClose, review, onEdit }) => {
    const theme = useTheme();

    const header = `Review from <strong>${review?.user.firstName} ${review?.user.lastName} - ${review?.user.email}</strong> for <strong>${review?.product.name}</strong>`;
    const user = `${review?.user.firstName} ${review?.user.lastName} - ${review?.user.email}`;

    const handleEditClick = () => {
        onClose();
        onEdit(review);
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
                        <Typography dangerouslySetInnerHTML={{ __html: header }} className='!text-lg' />

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

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadReviewData(review)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching review" />
                )}
            </Box>
        </Drawer>
    );
};

export default ReviewDetailsDrawer;
