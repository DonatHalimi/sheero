import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddReviewModal from '../../components/Modal/Review/AddReviewModal';
import DeleteReviewModal from '../../components/Modal/Review/DeleteReviewModal';
import EditReviewModal from '../../components/Modal/Review/EditReviewModal';
import { AuthContext } from '../../context/AuthContext';

const ReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [addReviewOpen, setAddReviewOpen] = useState(false);
    const [editReviewOpen, setEditReviewOpen] = useState(false);
    const [deleteReviewOpen, setDeleteReviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

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
        setSelectedReviews((prevSelected) =>
            prevSelected.includes(reviewId)
                ? prevSelected.filter(id => id !== reviewId)
                : [...prevSelected, reviewId]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedReviews(e.target.checked ? reviews.map(review => review._id) : []);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const columns = [
        { key: 'checkbox', label: 'checkbox' },
        { key: 'user.username', label: 'User' },
        { key: 'rating', label: 'Rating' },
        { key: 'comment', label: 'Comment' },
        { key: 'product.name', label: 'Product' },
        { key: 'actions', label: 'Actions' }
    ];

    const renderActionButtons = (review) => (
        <ActionButton onClick={() => { setSelectedReview(review); setEditReviewOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>Reviews</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddReviewOpen(true)} className='!mr-4'>
                    Add Review
                </OutlinedBrownButton>
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
    );

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardTable
                    columns={columns}
                    data={reviews}
                    selectedItems={selectedReviews}
                    onSelectItem={handleSelectReview}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageClick}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                />

                <AddReviewModal open={addReviewOpen} onClose={() => setAddReviewOpen(false)} onAddSuccess={fetchReviews} />
                <EditReviewModal open={editReviewOpen} onClose={() => setEditReviewOpen(false)} review={selectedReview} onEditSuccess={fetchReviews} />
                <DeleteReviewModal open={deleteReviewOpen} onClose={() => setDeleteReviewOpen(false)} reviews={selectedReviews.map(id => reviews.find(review => review._id === id))} onDeleteSuccess={fetchReviews} />
            </div>
        </div>
    );
};

export default ReviewsPage;