import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Checkbox } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddReviewModal from '../../components/Modal/Review/AddReviewModal';
import EditReviewModal from '../../components/Modal/Review/EditReviewModal';
import DeleteReviewModal from '../../components/Modal/Review/DeleteReviewModal';
import { AuthContext } from '../../context/AuthContext';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState('');
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [addReviewOpen, setAddReviewOpen] = useState(false);
    const [editReviewOpen, setEditReviewOpen] = useState(false);
    const [deleteReviewOpen, setDeleteReviewOpen] = useState(false);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const fetchReviews = async () => {
        try {
            const response = await axiosInstance.get('/reviews/get');
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [deleteReviewOpen, axiosInstance]);

    const refreshReviews = async () => {
        try {
            const response = await axiosInstance.get('/reviews/get');
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews', error);
        }
    };

    const handleSelectReview = (reviewId) => {
        setSelectedReviews((prevSelected) => {
            if (prevSelected.includes(reviewId)) {
                return prevSelected.filter(id => id !== reviewId);
            } else {
                return [...prevSelected, reviewId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedReviews(reviews.map(review => review._id));
        } else {
            setSelectedReviews([]);
        }
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex items-center justify-between w-full mb-4'>
                    <Typography variant='h5'>Reviews</Typography>
                    <div>
                        <OutlinedBrownButton onClick={() => setAddReviewOpen(true)} className='!mr-4'>Add Review</OutlinedBrownButton>
                        {selectedReviews.length > 0 && (
                            <OutlinedBrownButton
                                onClick={() => setDeleteReviewOpen(true)}
                                disabled={selectedReviews.length === 0}
                            >
                                {selectedReviews.length > 1 ? 'Delete Selected Reviews' : 'Delete Review'}
                            </OutlinedBrownButton>
                        )}
                    </div>
                </div>
                <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <BoldTableCell>
                                    <Checkbox
                                        checked={selectedReviews.length === reviews.length}
                                        onChange={handleSelectAll}
                                    />
                                </BoldTableCell>
                                <BoldTableCell>User</BoldTableCell>
                                <BoldTableCell>Comment</BoldTableCell>
                                <BoldTableCell>Product</BoldTableCell>
                                <BoldTableCell>Actions</BoldTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <TableRow key={review._id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedReviews.includes(review._id)}
                                                onChange={() => handleSelectReview(review._id)}
                                            />
                                        </TableCell>
                                        <TableCell>{review.user.username}</TableCell>
                                        <TableCell>{review.comment}</TableCell>
                                        <TableCell>{review.product.name}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedReview(review); setEditReviewOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No reviews found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <AddReviewModal open={addReviewOpen} onClose={() => setAddReviewOpen(false)} onAddSuccess={refreshReviews} />
                <EditReviewModal open={editReviewOpen} onClose={() => setEditReviewOpen(false)} review={selectedReview} onEditSuccess={refreshReviews} />
                <DeleteReviewModal open={deleteReviewOpen} onClose={() => setDeleteReviewOpen(false)} reviews={selectedReviews.map(id => reviews.find(review => review._id === id))} onDeleteSuccess={refreshReviews} />
            </div>
        </div>
    );
};

export default ReviewsPage;
