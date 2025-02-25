import { Box, Chip, Rating, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, PersonAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { chipSx } from '../../../assets/sx';
import { editReviewService } from '../../../services/reviewService';
import { getImageUrl } from '../../../utils/config';

const EditReviewModal = ({ open, onClose, review, onViewDetails, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [isValidTitle, setIsValidTitle] = useState(true);
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [isValidComment, setIsValidComment] = useState(true);
    const [product, setProduct] = useState('');
    const [loading, setLoading] = useState(false);

    const validateTitle = (v) => /^[A-Z][\Wa-zA-Z\s]{2,40}$/.test(v);
    const validateComment = (v) => /^[A-Z][\Wa-zA-Z\s]{3,500}$/.test(v);

    const isValidForm = isValidTitle && isValidComment && rating && product;

    const user = review?.user ? `${review.user.firstName} ${review.user.lastName} - ${review.user.email}` : 'Unknown User';

    useEffect(() => {
        if (review) {
            setTitle(review.title || '');
            setRating(Number(review.rating) || null);
            setComment(review.comment || '');
            setProduct(review.product?._id || '');
        }
    }, [review]);

    const handleEditReview = async () => {
        setLoading(true);

        const updatedData = {
            title,
            rating,
            comment,
        };

        try {
            const response = await editReviewService(review._id, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Review</CustomTypography>

                <ReadOnlyTextField
                    label="User"
                    value={user}
                    InputProps={PersonAdornment()}
                    className='!mb-4'
                />

                {review?.product ? (
                    <Box className="mb-4 !mt-[-8px]">
                        <Typography variant="body2" className="!text-gray-700">Product</Typography>
                        <Box sx={chipSx}>
                            <Chip
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Box
                                            onClick={() => window.open(`/product/${review.product._id}`, '_blank')}
                                            display="flex"
                                            alignItems="center"
                                            gap={1}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <img
                                                src={getImageUrl(review.product.image)}
                                                alt={review.product.name}
                                                className="w-10 h-10 object-contain"
                                            />
                                            <Typography variant="body2" className="!font-semibold hover:underline">
                                                {review.product.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                }
                                variant="outlined"
                                className="w-full !justify-start"
                            />
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body2" className="!text-gray-700">No product associated with this review.</Typography>
                )}

                <BrownOutlinedTextField
                    label="Title"
                    value={title}
                    fullWidth
                    onChange={(e) => {
                        setTitle(e.target.value)
                        setIsValidTitle(validateTitle(e.target.value))
                    }}
                    error={!isValidTitle}
                    helperText={!isValidTitle ? 'Title must start with a capital letter and be 2-40 characters long' : ''}
                    className='!mb-4'
                />

                <Rating
                    name="product-rating"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                    precision={1}
                    max={5}
                    min={1}
                    size="large"
                    sx={{ color: '#6D4C41', '& .MuiRating-iconFilled': { color: '#5A504B' }, '& .MuiRating-iconEmpty': { color: '#D7CCC8' } }}
                    className='mb-4'
                />

                <BrownOutlinedTextField
                    label="Comment"
                    value={comment}
                    multiline
                    rows={4}
                    fullWidth
                    onChange={(e) => {
                        setComment(e.target.value)
                        setIsValidComment(validateComment(e.target.value))
                    }}
                    error={!isValidComment}
                    helperText={!isValidComment ? 'Comment must start with a capital letter and be 3-500 characters long' : ''}
                    className='!mb-4'
                />

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditReview}
                    onSecondaryClick={() => {
                        onViewDetails(review);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: !isValidForm || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditReviewModal;