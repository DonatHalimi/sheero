import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { calculatePageCount, CustomDeleteModal, CustomMenu, CustomPagination, EmptyState, getPaginatedItems, handlePageChange, Header, LoadingOverlay, LoadingReviewItem, ProfileLayout, ReviewModal } from '../../assets/CustomComponents';
import emptyReviewsImage from '../../assets/img/empty/reviews.png';
import { paginationSx } from '../../assets/sx';
import Navbar from '../../components/Navbar/Navbar';
import ReviewItem from '../../components/Product/Items/ReviewItem';
import EditReviewModal from '../../components/Product/Modals/EditReviewModal';
import Footer from '../../components/Utils/Footer';
import { deleteUserReview, getUserReviews } from '../../store/actions/reviewActions';

const itemsPerPage = 4;

const Reviews = () => {
    const { user } = useSelector((state) => state.auth);
    const { reviews, loading } = useSelector((state) => state.reviews);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        dispatch(getUserReviews(user.id));
    }, [dispatch, user.id]);

    const filteredReviews = Array.isArray(reviews)
        ? reviews.filter(({ product: { name }, title, rating, comment }) => {
            const fields = [name, title, rating?.toString(), comment];
            const matchesSearchTerm = fields.some(field =>
                field?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesStatusFilter =
                statusFilter === 'All' || (rating && rating >= parseInt(statusFilter));
            return matchesSearchTerm && matchesStatusFilter;
        })
        : [];

    const handleMenuClick = (event, review) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedReview(review);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleEditSuccess = () => {
        setLoadingOverlay(false);
        dispatch(getUserReviews(user.id));
    };

    const handleDeleteClick = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleDeleteConfirm = async () => {
        if (selectedReview) {
            try {
                await dispatch(deleteUserReview(selectedReview._id));
                toast.success('Review deleted successfully');
                setOpenDeleteModal(false);

                await dispatch(getUserReviews(user.id));
            } catch (err) {
                console.error('Failed to delete review:', err.message);
                toast.error('Failed to delete review');
            }
        }
    };

    const handleImageClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handlePaperClick = (review) => {
        setSelectedReview(review);
        setOpenReviewModal(true);
    };

    const applyMargin = () => {
        return (filteredReviews.length === 1 || currentPageItems.length === 1) ? 'mb-40' : '';
    };

    const pageCount = calculatePageCount(filteredReviews, itemsPerPage);
    const currentPageItems = getPaginatedItems(filteredReviews, currentPage, itemsPerPage);

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title="Reviews"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showSearch={reviews.length > 0}
                    showFilter={reviews.length > 0}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    placeholder="Search reviews..."
                    filterType="reviews"
                />
                {loading ? (
                    <LoadingReviewItem />
                ) : filteredReviews.length === 0 ? (
                    <EmptyState
                        imageSrc={emptyReviewsImage}
                        context="reviews"
                        items={reviews}
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                    />
                ) : (
                    <div className={`flex flex-col ${applyMargin()}`}>
                        <div className="grid gap-4 mb-3">
                            {currentPageItems.map((review) => (
                                <ReviewItem
                                    key={review._id}
                                    review={review}
                                    onImageClick={handleImageClick}
                                    onMenuClick={handleMenuClick}
                                    onCardClick={handlePaperClick}
                                />
                            ))}
                        </div>

                        <div className="flex justify-start sm:justify-start">
                            <CustomPagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange(setCurrentPage)}
                                size="medium"
                                sx={paginationSx}
                            />
                        </div>
                    </div>
                )}
            </ProfileLayout>

            <Footer />

            <CustomMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                handleMenuClose={handleMenuClose}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
            />

            {selectedReview && (
                <>
                    <EditReviewModal
                        open={openEditModal}
                        onClose={() => setOpenEditModal(false)}
                        review={selectedReview}
                        onEditSuccess={handleEditSuccess}
                    />
                    <CustomDeleteModal
                        open={openDeleteModal}
                        onClose={() => setOpenDeleteModal(false)}
                        onDelete={handleDeleteConfirm}
                        title="Delete Review"
                        message="Are you sure you want to delete this review?"
                    />
                    <ReviewModal
                        open={openReviewModal}
                        handleClose={() => setOpenReviewModal(false)}
                        selectedReview={selectedReview}
                        onImageClick={handleImageClick}
                    />
                </>
            )}

            {loadingOverlay && <LoadingOverlay />}
        </>
    );
};

export default Reviews;