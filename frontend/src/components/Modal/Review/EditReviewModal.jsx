import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const EditReviewModal = ({ open, onClose, review, onEditSuccess }) => {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [product, setProduct] = useState('');
    const [products, setProducts] = useState([]);

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

        fetchProducts();
    }, [axiosInstance]);

    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setComment(review.comment);
            setProduct(review.product._id);
        }
    }, [review]);

    const handleEditReview = async () => {
        if (!rating || !comment || !product) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true,
            });
            return;
        }

        try {
            await axiosInstance.put(`/reviews/update/${review._id}`, {
                rating,
                comment,
                productId: product
            });
            toast.success('Review edited successfully');
            onEditSuccess();
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
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <Typography variant='h5' className="!text-xl !font-bold !mb-6">Edit Review</Typography>
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
                        onClick={handleEditReview}
                        fullWidth
                    >
                        Save Changes
                    </BrownButton>
                </Box>
            </div>
        </Modal>
    );
};

export default EditReviewModal;