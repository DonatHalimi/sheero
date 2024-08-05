import { Box, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const AddReviewModal = ({ open, onClose, onAddSuccess }) => {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [productId, setProductId] = useState('');
    const [products, setProducts] = useState([]);
    const [userReviews, setUserReviews] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

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
    }, [axiosInstance]);

    const handleAddReview = async () => {
        if (!rating || !comment || !productId) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true,
            });
            return;
        }

        // Check if the user has already reviewed this product
        const alreadyReviewed = userReviews.some(review => review.productId === productId);

        if (alreadyReviewed) {
            toast.error('You have already reviewed this product', {
                closeOnClick: true,
            });
            return;
        }

        try {
            await axiosInstance.post(`/reviews/product/${productId}`, {
                rating,
                comment,
            });
            toast.success('Review added successfully');
            onAddSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding review', error);
            toast.error('Error adding review');
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md">
                <Typography variant='h5' className="!text-xl !font-bold !mb-4">Add Review</Typography>
                <FormControl fullWidth className='!mb-4'>
                    <InputLabel id="product-label">Product</InputLabel>
                    <Select
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
                    label="Rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    fullWidth
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    fullWidth
                    className='!mb-4'
                />
                <BrownButton
                    onClick={handleAddReview}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add
                </BrownButton>
            </Box>
        </Modal>
    );
};

export default AddReviewModal;