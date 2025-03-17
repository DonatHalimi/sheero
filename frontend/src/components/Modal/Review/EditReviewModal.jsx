import { Box, Chip, Rating, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomTextField, CustomTypography, DrawerTypography, handleApiError, PersonAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { chipSx } from '../../../assets/sx';
import { editReviewService } from '../../../services/reviewService';
import { getImageUrl } from '../../../utils/config';
import { ReviewValidations } from '../../../utils/validations/review';

const EditReviewModal = ({ open, onClose, review, onViewDetails, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [product, setProduct] = useState('');
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const validateTitle = (v) => ReviewValidations.titleRules.pattern.test(v);
    const validateComment = (v) => ReviewValidations.commentRules.pattern.test(v);

    const isFormValid = validateTitle(title) && rating && validateComment(comment) && product;

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
                        <DrawerTypography theme={theme}>Product</DrawerTypography>
                        <Box sx={chipSx}>
                            <Chip
                                label={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Box
                                            onClick={() => window.open(`/${review.product.slug}`, '_blank')}
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

                <CustomTextField
                    label="Title"
                    value={title}
                    setValue={setTitle}
                    validate={validateTitle}
                    validationRule={ReviewValidations.titleRules}
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

                <CustomTextField
                    label="Comment"
                    value={comment}
                    setValue={setComment}
                    validate={validateComment}
                    validationRule={ReviewValidations.commentRules}
                    multiline
                    rows={4}
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
                        disabled: !isFormValid || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditReviewModal;