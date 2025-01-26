import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { CloseButton, downloadReviewData, EditExportButtons, RatingStars, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { drawerPaperSx } from '../../../assets/sx';

const ReviewDetailsDrawer = ({ open, onClose, review, onEdit }) => {
    const header = `Review from ${review?.user.firstName} ${review?.user.lastName} - ${review?.user.email} for ${review?.product.name}`;
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
                        <Typography className='!font-bold !text-lg'>
                            {header}
                        </Typography>

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

                        <div className='flex items-center relative !mb-3 text-xl'>
                            <RatingStars rating={review.rating} />
                        </div>

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
