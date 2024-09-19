import { Rating, TextField } from '@mui/material';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import { AuthContext } from '../../context/AuthContext';

const AddReviewModal = ({ open, onClose, product, onReviewSuccess }) => {
    const { auth } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const axiosInstance = useAxios();

    const handleAddReview = async () => {
        if (!auth.accessToken) {
            toast.info('You need to be logged in to add a review');
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

        try {
            await axiosInstance.post(`/reviews/product/${product._id}`, {
                title,
                rating,
                comment,
            });
            toast.success('Review added successfully');
            onReviewSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error adding review');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5" className="!text-gray-800 !font-semilight">
                    Add Review
                </CustomTypography>

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
