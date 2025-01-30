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
    const [deleteReviewOpen, setDeleteReviewOpen] = useState(false);
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

    const handleSelectReview = (reviewId) => {
        const id = Array.isArray(reviewId) ? reviewId[0] : reviewId;

        setSelectedReviews((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedReviews(e.target.checked ? reviews.map(review => review._id) : []);
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

    const getSelectedReviews = () => {
        return selectedReviews
            .map((id) => reviews.find((review) => review._id === id))
            .filter((review) => review);
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

    const columns = [
        {
            key: 'user',
            label: 'User',
            render: (review) => `${review.user.firstName} ${review.user.lastName} - ${review.user.email}`
        },
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
        {
            key: 'comment',
            label: 'Comment',
            render: (review) => review.comment ? review.comment : 'N/A'
        },
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
                            setDeleteItemOpen={setDeleteReviewOpen}
                            itemName="Review"
                            exportOptions={exportOptions(reviews, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={reviews}
                            selectedItems={selectedReviews}
                            onSelectItem={handleSelectReview}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                        />
                    </>
                )}

                <AddReviewModal open={addReviewOpen} onClose={() => setAddReviewOpen(false)} onAddSuccess={() => dispatch(getReviews())} />
                <EditReviewModal open={editReviewOpen} onClose={() => setEditReviewOpen(false)} review={selectedReview} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getReviews())} />
                <ReviewDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} review={selectedReview} onEdit={handleEditFromDrawer} />
                <DeleteModal
                    open={deleteReviewOpen}
                    onClose={() => setDeleteReviewOpen(false)}
                    items={getSelectedReviews()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/reviews/delete-bulk"
                    title="Delete Reviews"
                    message="Are you sure you want to delete the selected reviews?"
                />
            </div>
        </div>
    );
};

export default ReviewsPage;
