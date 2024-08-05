import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import AddReviewModal from '../../components/Modal/Review/AddReviewModal';
import DeleteReviewModal from '../../components/Modal/Review/DeleteReviewModal';
import EditReviewModal from '../../components/Modal/Review/EditReviewModal';
import { AuthContext } from '../../context/AuthContext';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState('');
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [addReviewOpen, setAddReviewOpen] = useState(false);
    const [editReviewOpen, setEditReviewOpen] = useState(false);
    const [deleteReviewOpen, setDeleteReviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchReviews();
    }, [addReviewOpen, editReviewOpen, deleteReviewOpen, axiosInstance]);

    const fetchReviews = async () => {
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

    const pageCount = Math.ceil(reviews.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = pageCount && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return reviews.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
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
                                <BoldTableCell>Rating</BoldTableCell>
                                <BoldTableCell>Comment</BoldTableCell>
                                <BoldTableCell>Product</BoldTableCell>
                                <BoldTableCell>Actions</BoldTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getCurrentPageItems().length > 0 ? (
                                getCurrentPageItems().map((review) => (
                                    <TableRow key={review._id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedReviews.includes(review._id)}
                                                onChange={() => handleSelectReview(review._id)}
                                            />
                                        </TableCell>
                                        <TableCell>{review.user.username}</TableCell>
                                        <TableCell>{review.rating}</TableCell>
                                        <TableCell>{review.comment}</TableCell>
                                        <TableCell>{review.product.name}</TableCell>
                                        <TableCell>
                                            <ActionButton onClick={() => { setSelectedReview(review); setEditReviewOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No review found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <AddReviewModal open={addReviewOpen} onClose={() => setAddReviewOpen(false)} onAddSuccess={fetchReviews} />
                <EditReviewModal open={editReviewOpen} onClose={() => setEditReviewOpen(false)} review={selectedReview} onEditSuccess={fetchReviews} />
                <DeleteReviewModal open={deleteReviewOpen} onClose={() => setDeleteReviewOpen(false)} reviews={selectedReviews.map(id => reviews.find(review => review._id === id))} onDeleteSuccess={fetchReviews} />

                {reviews.length > 0 && paginationEnabled && (
                    <div className="w-full flex justify-start mt-6 mb-24">
                        <ReactPaginate
                            pageCount={pageCount}
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={1}
                            onPageChange={handlePageClick}
                            containerClassName="inline-flex -space-x-px text-sm"
                            activeClassName="text-white bg-stone-500"
                            previousLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-e-0 border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isPreviousDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                            nextLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isNextDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                            disabledClassName="text-gray-50 cursor-not-allowed"
                            activeLinkClassName="text-stone-600 font-extrabold"
                            previousLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 hover:text-gray-700">Previous</span>}
                            nextLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 hover:text-gray-700">Next</span>}
                            breakLabel={<span className="flex items-center justify-center px-4 h-10 text-gray-500 bg-white border border-gray-300">...</span>}
                            pageClassName="flex items-center justify-center px-1 h-10 text-gray-500 border border-gray-300 cursor-pointer bg-white"
                            pageLinkClassName="flex items-center justify-center px-3 h-10 text-gray-500 cursor-pointer"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsPage;