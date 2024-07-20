import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, BrownDeleteOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
import AddReviewModal from '../../components/Modal/Review/AddReviewModal';
import DeleteReviewModal from '../../components/Modal/Review/DeleteReviewModal';
import EditReviewModal from '../../components/Modal/Review/EditReviewModal';
import { AuthContext } from '../../context/AuthContext';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
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
    }, [addReviewOpen, editReviewOpen, deleteReviewOpen, axiosInstance]);

    const refreshReviews = async () => {
        try {
            const response = await axiosInstance.get('/reviews/get');
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews', error);
        }
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <div className='flex items-center justify-between w-full mb-4'>
                    <Typography variant='h5'>Reviews</Typography>
                    <OutlinedBrownButton onClick={() => setAddReviewOpen(true)}>Add Review</OutlinedBrownButton>
                </div>
                <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <BoldTableCell>User</BoldTableCell>
                                <BoldTableCell>Product</BoldTableCell>
                                <BoldTableCell>Rating</BoldTableCell>
                                <BoldTableCell>Comment</BoldTableCell>
                                <BoldTableCell>Actions</BoldTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reviews.map((review) => (
                                <TableRow key={review._id}>
                                    <TableCell>{review.user?.username}</TableCell>
                                    <TableCell>{review.product?.name}</TableCell>
                                    <TableCell>{review.rating}</TableCell>
                                    <TableCell>{review.comment}</TableCell>
                                    <TableCell>
                                        <ActionButton onClick={() => { setSelectedReview(review); setEditReviewOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                        <ActionButton onClick={() => { setSelectedReview(review); setDeleteReviewOpen(true); }}><BrownDeleteOutlinedIcon /></ActionButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <AddReviewModal open={addReviewOpen} onClose={() => setAddReviewOpen(false)} onAddSuccess={refreshReviews} />
                <EditReviewModal open={editReviewOpen} onClose={() => setEditReviewOpen(false)} review={selectedReview} onEditSuccess={refreshReviews} />
                <DeleteReviewModal open={deleteReviewOpen} onClose={() => setDeleteReviewOpen(false)} review={selectedReview} onDeleteSuccess={refreshReviews} />
            </div>
        </div>
    );
};

export default ReviewsPage;
