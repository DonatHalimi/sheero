import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, RatingStars } from '../../assets/CustomComponents';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddReviewModal from '../../components/Modal/Review/AddReviewModal';
import EditReviewModal from '../../components/Modal/Review/EditReviewModal';
import { getReviews } from '../../store/actions/dashboardActions';

const ReviewsPage = () => {
    const { reviews } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedReview, setSelectedReview] = useState(null);
    const [selectedReviews, setSelectedReviews] = useState([]);
    const [addReviewOpen, setAddReviewOpen] = useState(false);
    const [editReviewOpen, setEditReviewOpen] = useState(false);
    const [deleteReviewOpen, setDeleteReviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getReviews());
    }, [dispatch]);

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

    const columns = [
        { key: 'user.firstName', label: 'First Name' },
        { key: 'user.lastName', label: 'Last Name' },
        { key: 'user.email', label: 'Email' },
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
        { key: 'product.name', label: 'Product' },
        { key: 'actions', label: 'Actions' }
    ];


    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="Reviews"
                    selectedItems={selectedReviews}
                    setAddItemOpen={setAddReviewOpen}
                    setDeleteItemOpen={setDeleteReviewOpen}
                    itemName="Review"
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
                />

                <AddReviewModal open={addReviewOpen} onClose={() => setAddReviewOpen(false)} onAddSuccess={() => dispatch(getReviews())} />
                <EditReviewModal open={editReviewOpen} onClose={() => setEditReviewOpen(false)} review={selectedReview} onEditSuccess={() => dispatch(getReviews())} />
                <DeleteModal
                    open={deleteReviewOpen}
                    onClose={() => setDeleteReviewOpen(false)}
                    items={selectedReviews.map(id => reviews.find(review => review._id === id)).filter(review => review)}
                    onDeleteSuccess={() => dispatch(getReviews())}
                    endpoint="/reviews/delete-bulk"
                    title="Delete Reviews"
                    message="Are you sure you want to delete the selected reviews?"
                />
            </div>
        </div>
    );
};

export default ReviewsPage;
