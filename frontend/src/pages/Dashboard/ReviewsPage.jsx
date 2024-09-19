import React, { useContext, useEffect, useState } from 'react';
import { DashboardHeader, RatingStars } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import AddReviewModal from '../../components/Modal/Review/AddReviewModal';
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
        { key: 'user.username', label: 'User' },
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

                <AddReviewModal open={addReviewOpen} onClose={() => setAddReviewOpen(false)} onAddSuccess={fetchReviews} />
                <EditReviewModal open={editReviewOpen} onClose={() => setEditReviewOpen(false)} review={selectedReview} onEditSuccess={fetchReviews} />
                <DeleteModal
                    open={deleteReviewOpen}
                    onClose={() => setDeleteReviewOpen(false)}
                    items={selectedReviews.map(id => reviews.find(review => review._id === id)).filter(review => review)}
                    onDeleteSuccess={fetchReviews}
                    endpoint="/reviews/delete-bulk"
                    title="Delete Reviews"
                    message="Are you sure you want to delete the selected reviews?"
                />
            </div>
        </div>
    );
};

export default ReviewsPage;
