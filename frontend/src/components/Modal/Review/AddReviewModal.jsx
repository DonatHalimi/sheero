import { FormControl, InputLabel, MenuItem, Rating, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addReviewService, getProductNamesService, getReviewsService } from '../../../services/reviewService';
import { ReviewValidations } from '../../../utils/validations/review';

const AddReviewModal = ({ open, onClose, onAddSuccess }) => {
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [productId, setProductId] = useState(null);
    const [products, setProducts] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateTitle = (v) => ReviewValidations.titleRules.pattern.test(v);
    const validateComment = (v) => ReviewValidations.commentRules.pattern.test(v);

    const isFormValid = validateTitle(title) && rating && validateComment(comment) && productId;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProductNamesService();
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        const fetchUserReviews = async () => {
            try {
                const response = await getReviewsService();
                setUserReviews(response.data);
            } catch (error) {
                console.error('Error fetching user reviews', error);
            }
        };

        fetchProducts();
        fetchUserReviews();
    }, []);

    const handleAddReview = async () => {
        setLoading(true);

        if (!title || rating < 1 || rating > 5 || !productId) {
            toast.error('Please fill in all the fields and select a rating between 1 and 5 stars');
            return;
        }

        // Check if the user has already reviewed this product
        const alreadyReviewed = userReviews.some(review => review.productId === productId);

        if (alreadyReviewed) {
            toast.error('You have already reviewed this product');
            return;
        }

        const data = {
            title,
            rating,
            comment,
        };

        try {
            const response = await addReviewService(productId, data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Review</CustomTypography>

                <FormControl fullWidth className='!mb-4'>
                    <InputLabel id="product-label">Product</InputLabel>
                    <Select
                        labelId="product-label"
                        label="Product"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                    >
                        {products.map((product) => (
                            <MenuItem key={product._id} value={product._id}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

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

                <BrownButton
                    onClick={handleAddReview}
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddReviewModal;
