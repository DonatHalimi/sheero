import { Rating, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';

const EditReviewModal = ({ open, onClose, review, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const axiosInstance = useAxios();

    useEffect(() => {
        if (review) {
            setTitle(review.title);
            setRating(Number(review.rating));
            setComment(review.comment);
        }
    }, [review]);

    const handleEditReview = async () => {
        if (!title || rating === null || !comment) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true,
            });
            return;
        }
    
        try {
            const response = await axiosInstance.put(`/reviews/update/${review._id}`, {
                title,
                rating,
                comment,
            });
            toast.success('Review edited successfully');
            onEditSuccess(response.data);
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

                <TextField
                    label="Product"
                    value={review?.product?.name || ''}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    disabled={!!review?.product?.name}
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

                <BrownButton onClick={handleEditReview} fullWidth>
                    Save Changes
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditReviewModal;