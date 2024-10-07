import { Rating, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import { AuthContext } from '../../context/AuthContext';

const AddReviewModal = ({ open, onClose, product, onReviewSuccess }) => {
    const { auth } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [canReview, setCanReview] = useState(null);

    const axiosInstance = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfCanReview = async () => {
            if (!auth.accessToken) return;

            try {
                const response = await axiosInstance.get(`/reviews/orders/check-review/${product._id}`);
                setCanReview(response.data.canReview);
            } catch (error) {
                console.error('Error checking review eligibility:', error);
            }
        };

        if (open) {
            checkIfCanReview();
        }
    }, [open, product, auth.accessToken, axiosInstance]);

    const handleAddReview = async () => {
        if (!auth.accessToken) {
            toast.info('You need to be logged in to add a review');
            return;
        }

        if (!canReview) {
            toast.error('Product can only be reviewed after buying it');
            return;
        }

        if (title.length > 60) {
            toast.error('Title cannot exceed 60 characters');
            return;
        }

        if (!title || rating === null || !comment) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            title,
            rating,
            comment,
        }

        try {
            await axiosInstance.post(`/reviews/product/${product._id}`, data);
            toast.success('Review added successfully', {
                onClick: () => navigate('/profile/reviews'),
            });
            onReviewSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding review');
        }
    }

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5" className="!text-gray-800 !font-semilight">
                    Add Review
                </CustomTypography>

                {canReview === false && (
                    <CustomTypography variant="body2" className="!text-red-600">
                        Product can only be reviewed after buying it.
                    </CustomTypography>
                )}

                <TextField
                    label="Product"
                    value={product?.name || ''}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    disabled={!!product?.name}
                    className="!mb-4"
                />

                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    className="!mb-4"
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

                <BrownButton onClick={handleAddReview} fullWidth>
                    Submit Review
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddReviewModal;