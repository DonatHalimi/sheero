import { Rating, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTextField, CustomTypography, LoadingLabel } from '../../../assets/CustomComponents';
import { addReviewService, checkReviewEligibilityService } from '../../../services/reviewService';
import { ReviewValidations } from '../../../utils/validations/review';

const AddReviewModal = ({ open, onClose, product, onReviewSuccess }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [canReview, setCanReview] = useState(null);

    const [titleValid, setTitleValid] = useState(true);
    const [commentValid, setCommentValid] = useState(true);
    const [focusedField, setFocusedField] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateTitle = (v) => ReviewValidations.titleRules.pattern.test(v);
    const validateComment = (v) => ReviewValidations.commentRules.pattern.test(v);

    const navigate = useNavigate();

    useEffect(() => {
        const checkIfCanReview = async () => {
            if (!isAuthenticated) {
                toast.error('You need to log in first.');
                navigate('/login');
                return;
            }

            try {
                const response = await checkReviewEligibilityService(product._id);
                setCanReview(response.data.canReview);
            } catch (error) {
                console.error('Error checking review eligibility:', error);
            }
        };

        if (open) {
            checkIfCanReview();
        }
    }, [open, product, isAuthenticated]);

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

    const handleAddReview = async () => {
        setLoading(true);
        if (!isAuthenticated) {
            toast.info('You need to be logged in to add a review');
            setLoading(false);
            return;
        }

        if (!canReview) {
            toast.error('Product can only be reviewed after buying it');
            setLoading(false);
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
        };

        try {
            await addReviewService(product._id, data);

            toast.success('Review added successfully', {
                onClick: () => navigate('/profile/reviews'),
            });
            onReviewSuccess();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach((err) => {
                    toast.error(`${err.message}`, {
                        onClick: () => navigate('/profile/reviews'),
                    });
                });
            } else {
                toast.error('Error adding review');
            }
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = !title || !rating || !comment || !validateTitle(title) || !validateComment(comment);

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5" className="!text-gray-800 !font-semilight">
                    Add Review
                </CustomTypography>

                {canReview === false && (
                    <CustomTypography variant="body2" className="!text-red-600">
                        Product can only be reviewed after buying it
                    </CustomTypography>
                )}

                <TextField
                    label="Product"
                    value={product?.name || ''}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                    variant="outlined"
                    disabled={!!product?.name}
                    className="!mb-4"
                />

                {/* <TextField
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
                        <span className="block text-xs font-semibold mb-1">Invalid Title</span>
                        Must start with a capital letter and be 2 to 40 characters long.
                        <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                    </div>
                )} */}

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
                    sx={{
                        color: '#6D4C41',
                        '& .MuiRating-iconFilled': { color: '#5A504B' },
                        '& .MuiRating-iconEmpty': { color: '#D7CCC8' },
                    }}
                    className="mb-6"
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

                <BrownButton
                    onClick={handleAddReview}
                    disabled={isDisabled || loading}
                    fullWidth
                >
                    <LoadingLabel loading={loading} defaultLabel="Submit" loadingLabel="Submitting" />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddReviewModal;