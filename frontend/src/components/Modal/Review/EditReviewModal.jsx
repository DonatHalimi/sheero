import { InputLabel, MenuItem, Rating, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, OutlinedBrownFormControl, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { editReviewService, getProductNamesService } from '../../../services/reviewService';

const EditReviewModal = ({ open, onClose, review, onViewDetails, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [isValidTitle, setIsValidTitle] = useState(true);
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [isValidComment, setIsValidComment] = useState(true);
    const [product, setProduct] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateTitle = (v) => /^[A-Z][\Wa-zA-Z\s]{2,40}$/.test(v);
    const validateComment = (v) => /^[A-Z][\Wa-zA-Z\s]{3,500}$/.test(v);

    const isValidForm = isValidTitle && isValidComment && rating && product;

    const user = review?.user.firstName + ' ' + review?.user.lastName + ' - ' + review?.user.email

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProductNamesService();
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (review) {
            setTitle(review.title);
            setRating(Number(review.rating));
            setComment(review.comment);
            setProduct(review.product._id);
        }
    }, [review]);

    const handleEditReview = async () => {
        setLoading(true);

        const updatedData = {
            title,
            rating,
            comment,
            productId: product
        }

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

                <OutlinedBrownFormControl fullWidth className="mb-4">
                    <InputLabel>Product</InputLabel>
                    <Select
                        label="Product"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        className='!mb-4'
                    >
                        {products.map((product) => (
                            <MenuItem key={product._id} value={product._id}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>

                <ReadOnlyTextField
                    label="User"
                    value={user}
                    className='!mb-4'
                />

                <BrownOutlinedTextField
                    label="Title"
                    value={title}
                    fullWidth
                    onChange={(e) => {
                        setTitle(e.target.value)
                        setIsValidTitle(validateTitle(e.target.value))
                    }}
                    error={!isValidTitle}
                    helperText={!isValidTitle ? 'Title must start with a capital letter and be 2-40 characters long' : ''}
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
                        setIsValidComment(validateComment(e.target.value))
                    }}
                    error={!isValidComment}
                    helperText={!isValidComment ? 'Comment must start with a capital letter and be 3-500 characters long' : ''}
                    className='!mb-4'
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
                        disabled: !isValidForm || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditReviewModal;