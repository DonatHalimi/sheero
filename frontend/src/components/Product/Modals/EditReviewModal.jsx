import { Rating } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography, LoadingLabel, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { editUserReview, getUserReviews } from '../../../store/actions/reviewActions';
import { ReviewValidations } from '../../../utils/validations/review';

const EditReviewModal = ({ open, onClose, review, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const [focusedField, setFocusedField] = useState(null);
    const dispatch = useDispatch();

    const validateTitle = (v) => ReviewValidations.titleRules.pattern.test(v);
    const validateComment = (v) => ReviewValidations.commentRules.pattern.test(v);

    useEffect(() => {
        if (review) {
            setTitle(review.title);
            setRating(Number(review.rating));
            setComment(review.comment);
        }
    }, [review]);

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

                <CustomTextField
                    label="Title"
                    value={title}
                    setValue={setTitle}
                    validate={validateTitle}
                    validationRule={ReviewValidations.titleRules}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
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

                <CustomTextField
                    label="Comment"
                    value={comment}
                    setValue={setComment}
                    validate={validateComment}
                    validationRule={ReviewValidations.commentRules}
                    onFocus={() => setFocusedField('comment')}
                    onBlur={() => setFocusedField(null)}
                    multiline
                    rows={4}
                    error={!validateComment(comment) && comment !== ''}
                    helperText={!validateComment(comment) && comment !== '' ? ReviewValidations.commentRules.message : ''}
                />

                <BrownButton onClick={handleEditReview} disabled={isDisabled} fullWidth>
                    <LoadingLabel loading={loading} defaultLabel="Save" loadingLabel="Saving" />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditReviewModal;