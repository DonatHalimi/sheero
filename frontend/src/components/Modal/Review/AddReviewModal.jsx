import { FormControl, InputLabel, MenuItem, Rating, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const AddReviewModal = ({ open, onClose, onAddSuccess }) => {
    const [title, setTitle] = useState('');
    const [isValidTitle, setIsValidTitle] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isValidComment, setIsValidComment] = useState(true);
    const [productId, setProductId] = useState(null);
    const [products, setProducts] = useState([]);
    const [userReviews, setUserReviews] = useState([]);

    const axiosInstance = useAxios();

    const validateTitle = (v) => /^[A-Z][\Wa-zA-Z\s]{2,40}$/.test(v);
    const validateComment = (v) => /^[A-Z][\Wa-zA-Z\s]{3,500}$/.test(v);

    const isValidForm = isValidTitle && rating && isValidComment && productId;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('/reviews/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        const fetchUserReviews = async () => {
            try {
                const response = await axiosInstance.get('/reviews/get');
                setUserReviews(response.data);
            } catch (error) {
                console.error('Error fetching user reviews', error);
            }
        };

        fetchProducts();
        fetchUserReviews();
    }, []);

    const handleAddReview = async () => {
        if (!title || rating < 1 || rating > 5 || !productId) {
            toast.error('Please fill in all the fields and select a rating between 1 and 5 stars');
            return;
        }

        // Check if the user has already reviewed this product
        const alreadyReviewed = userReviews.some(review => review.productId === productId);

        if (alreadyReviewed) {
            toast.error('You have already reviewed this product', { closeOnClick: true });
            return;
        }

        const data = {
            title,
            rating,
            comment,
        }

        try {
            const response = await axiosInstance.post(`/reviews/product/${productId}`, data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding review');
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

                <BrownOutlinedTextField
                    label="Title"
                    value={title}
                    fullWidth
                    onChange={(e) => {
                        setTitle(e.target.value)
                        setIsValidTitle(validateTitle(e.target.value));
                    }}
                    error={!isValidTitle}
                    helperText={!isValidTitle ? 'Title must start with a capital letter and contain at least 3 characters' : ''}
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
                        setIsValidComment(validateComment(e.target.value));
                    }}
                    error={!isValidComment}
                    helperText={!isValidComment ? 'Comment must start with a capital letter and be 3-500 characters long' : ''}
                    className='!mb-4'
                />

                <BrownButton
                    onClick={handleAddReview}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddReviewModal;
