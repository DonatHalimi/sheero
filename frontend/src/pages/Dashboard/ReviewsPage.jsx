import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, LoadingDataGrid, RatingStars } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddReviewModal from '../../components/Modal/Review/AddReviewModal';
import EditReviewModal from '../../components/Modal/Review/EditReviewModal';
import ReviewDetailsDrawer from '../../components/Modal/Review/ReviewDetailsDrawer';
import { getReviews } from '../../store/actions/dashboardActions';

const ReviewsPage = () => {
    const { reviews, loadingReviews } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedReview, setSelectedReview] = useState(null);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [addReviewOpen, setAddReviewOpen] = useState(false);
    const [editReviewOpen, setEditReviewOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getReviews());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddReviewOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [reviews]);

    const handleSelectReview = (newSelection) => {
        setSelectedReviews(newSelection);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (review) => {
        setSelectedReview(review);
        setEditReviewOpen(true);
    };

    const handleEditFromDrawer = (review) => {
        setViewDetailsOpen(false);
        setSelectedReview(review);
        setEditReviewOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getReviews());
        setSelectedReviews([]);
    };

    const handleViewDetails = (review) => {
        setSelectedReview(review);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedReview(null);
    };

    const handleBulkDelete = () => {
        if (selectedReviews.length > 0) {
            setDeletionContext({
                endpoint: '/reviews/delete-bulk',
                data: { ids: selectedReviews },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (review) => {
        setDeletionContext({
            endpoint: `/reviews/delete/${review._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { key: 'user', label: 'User', render: (review) => `${review.user.firstName} ${review.user.lastName} - ${review.user.email}` },
        { key: 'product.name', label: 'Product' },
        { key: 'title', label: 'Title' },
        {
            key: 'rating',
            label: 'Rating',
            render: (review) => (
                <div style={{ position: 'relative', top: '20px' }}>
                    <RatingStars rating={review.rating} />
                </div>
            )
        },
        { key: 'comment', label: 'Comment', render: (review) => review.comment ? review.comment : 'N/A' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        const flattenedReviews = data.map(review => ({
            ...review,
            user: `${review.user.firstName} ${review.user.lastName} - ${review.user.email}`,
            product: review.product.name
        }))

        format === 'excel' ? exportToExcel(flattenedReviews, 'reviews_data') : exportToJSON(reviews, 'reviews_data');
    }

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingReviews ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Reviews"
                            selectedItems={selectedReviews}
                            setAddItemOpen={setAddReviewOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Review"
                            exportOptions={exportOptions(reviews, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={reviews}
                            selectedItems={selectedReviews}
                            onSelectItem={handleSelectReview}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddReviewModal open={addReviewOpen} onClose={() => setAddReviewOpen(false)} onAddSuccess={() => dispatch(getReviews())} />
                <EditReviewModal open={editReviewOpen} onClose={() => setEditReviewOpen(false)} review={selectedReview} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getReviews())} />
                <ReviewDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} review={selectedReview} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Reviews' : 'Delete Review'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected reviews?'
                        : 'Are you sure you want to delete this review?'
                    }
                />
            </div>
        </div>
    );
};

export default ReviewsPage;