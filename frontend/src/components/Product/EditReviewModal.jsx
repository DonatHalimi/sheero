import { Rating, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';

const EditReviewModal = ({ open, onClose, review, onEditSuccess }) => {
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const axiosInstance = useAxios();

    useEffect(() => {
        if (review) {
            setRating(Number(review.rating));
            setComment(review.comment);
        }
    }, [review]);

    const handleEditReview = async () => {
        if (rating === null || !comment) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true,
            });
            return;
        }

        try {
            await axiosInstance.put(`/reviews/update/${review._id}`, {
                rating,
                comment,
            });
            toast.success('Review edited successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            console.error('Error editing review', error);
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error editing review');
            }
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5" className="!text-gray-800 !font-semilight">Edit Review</CustomTypography>

                <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                    {review?.product?.name}
                </Typography>

                <Rating
                    name="product-rating"
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                    precision={1}
                    max={5}
                    min={1}
                    size="large"
                    className="mb-6"
                />
                <BrownOutlinedTextField
                    label="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    className="!mb-4"
                />
                <BrownButton onClick={handleEditReview} fullWidth>
                    Save Changes
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditReviewModal;