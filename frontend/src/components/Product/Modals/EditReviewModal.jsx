import { Rating } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, LoadingLabel, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { editUserReview, getUserReviews } from '../../../store/actions/reviewActions';
import { COMMENT_VALIDATION, TITLE_VALIDATION } from '../../../utils/constants/validations/review';

const EditReviewModal = ({ open, onClose, review, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [titleValid, setTitleValid] = useState(true);
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [commentValid, setCommentValid] = useState(true);
    const [loading, setLoading] = useState(false);

    const [focusedField, setFocusedField] = useState(null);
    const dispatch = useDispatch();

    const validateTitle = (v) => TITLE_VALIDATION.regex.test(v);
    const validateComment = (v) => COMMENT_VALIDATION.regex.test(v);

    useEffect(() => {
        if (review) {
            setTitle(review.title);
            setRating(Number(review.rating));
            setComment(review.comment);
        }
    }, [review]);

    const handleTitleChange = (event) => {
        const value = event.target.value;
        setTitle(value);
        setTitleValid(validateTitle(value));
    };

    const handleCommentChange = (event) => {
        const value = event.target.value;
        setComment(value);
        setCommentValid(validateComment(value));
    };

    const handleEditReview = async () => {
        setLoading(true);

        if (!review || !review._id) {
            toast.error('Invalid review ID');
            return;
        }

        const updatedData = {
            title,
            rating,
            comment,
        };

        try {
            dispatch(editUserReview(review._id, updatedData));
            toast.success('Review updated successfully');
            dispatch(getUserReviews(review.user._id));
            onEditSuccess(updatedData);
            onClose();
        } catch (error) {
            console.error('Error editing review', error);
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error editing review');
            }
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = !title || !rating || !comment || !validateTitle(title) || !validateComment(comment);

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5" className="!text-gray-800 !font-semilight">Edit Review</CustomTypography>

                <ReadOnlyTextField
                    label="Product"
                    value={review?.product?.name || ''}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                    variant="outlined"
                    disabled={!!review?.product?.name}
                    className="!mb-4"
                />

                <BrownOutlinedTextField
                    label="Title"
                    value={title}
                    onChange={handleTitleChange}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
                    fullWidth
                    className="!mb-4"
                />
                {focusedField === 'title' && !titleValid && (
                    <div className="absolute left-4 right-4 bottom-[206px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md z-10">
                        <span className="block text-xs font-semibold mb-1">{TITLE_VALIDATION.title}</span>
                        {TITLE_VALIDATION.message}
                        <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                    </div>
                )}

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
                    onChange={handleCommentChange}
                    onFocus={() => setFocusedField('comment')}
                    onBlur={() => setFocusedField(null)}
                    fullWidth
                    multiline
                    rows={4}
                    className="!mb-4"
                />
                {focusedField === 'comment' && !commentValid && (
                    <div className="absolute left-4 right-4 bottom-[206px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md z-10">
                        <span className="block text-xs font-semibold mb-1">{COMMENT_VALIDATION.title}</span>
                        {COMMENT_VALIDATION.message}
                        <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                    </div>
                )}

                <BrownButton
                    onClick={handleEditReview}
                    disabled={isDisabled}
                    fullWidth
                >
                    <LoadingLabel loading={loading} defaultLabel="Save" loadingLabel="Saving" />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditReviewModal;