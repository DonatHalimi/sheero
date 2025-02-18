import { Box, Chip, Drawer, Typography } from '@mui/material';
import React from 'react';
import { CloseButton, EditExportButtons, RatingStars, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadReviewData } from '../../../assets/DataExport';
import { drawerPaperSx, productChipSx } from '../../../assets/sx';

const ReviewDetailsDrawer = ({ open, onClose, review, onEdit }) => {
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
                        <Typography className='!text-lg' dangerouslySetInnerHTML={{ __html: header }} />

                        <ReadOnlyTextField
                            label="Review ID"
                            value={review._id}
                        />
                        <ReadOnlyTextField
                            label="User"
                            value={user}
                        />

                        <ReadOnlyTextField
                            label="Product ID"
                            value={review.product._id}
                        />

                        <ReadOnlyTextField
                            label="Product"
                            value={review.product.name}
                            multiline
                            rows={4}
                        />

                        <Box sx={productChipSx} className="flex flex-col gap-1">
                            <Typography variant="body2" className="!text-gray-700">Rating</Typography>
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
