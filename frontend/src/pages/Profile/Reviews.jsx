import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import emptyReviewsImage from '../../assets/img/empty/reviews.png';
import { paginationSx } from '../../assets/sx';
import { LoadingOverlay, LoadingReviewItem } from '../../components/custom/LoadingSkeletons';
import { CustomDeleteModal, CustomPagination, EmptyState } from '../../components/custom/MUI';
import { CustomMenu, ReviewModal } from '../../components/custom/Product';
import { Header, ProfileLayout } from '../../components/custom/Profile';
import Navbar from '../../components/Navbar/Navbar';
import ReviewItem from '../../components/Product/Items/ReviewItem';
import EditReviewModal from '../../components/Product/Modals/EditReviewModal';
import Footer from '../../components/Utils/Footer';
import { ITEMS_PER_PAGE } from '../../services/reviewService';
import { deleteUserReview, getUserReviews } from '../../store/actions/reviewActions';

const Reviews = () => {
    const { user } = useSelector((state) => state.auth);
    const { reviews, pagination, loading } = useSelector((state) => state.reviews);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');
    const [pageChanging, setPageChanging] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [loadingOverlay, setLoadingOverlay] = useState(false);

    const showBars = pagination.totalReviews > 0;

    const debouncedFetchReviews = useCallback(
        debounce((userId, page, limit, search, rating) => {
            dispatch(getUserReviews(userId, page, limit, search, rating)).finally(() => {
                setPageChanging(false);
            });
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (user?.id) {
            dispatch(getUserReviews(user.id, currentPage, ITEMS_PER_PAGE, searchTerm, ratingFilter));
        }
    }, [dispatch, user, currentPage, ratingFilter]);

    useEffect(() => {
        if (user?.id) {
            setCurrentPage(1);
            debouncedFetchReviews(user.id, 1, ITEMS_PER_PAGE, searchTerm, ratingFilter);
        }
    }, [user?.id, searchTerm, debouncedFetchReviews, ratingFilter]);

    const handleRatingFilterChange = (newRating) => {
        setRatingFilter(newRating);
        setCurrentPage(1);
    };

    const handleSearchTermChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

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
        dispatch(getUserReviews(user.id, currentPage, ITEMS_PER_PAGE, searchTerm, ratingFilter));
    };

    const handleDeleteClick = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleImageClick = (slug) => {
        navigate(`/${slug}`);
    };

    const handlePaperClick = (review) => {
        setSelectedReview(review);
        setOpenReviewModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedReview) {
            try {
                dispatch(deleteUserReview(selectedReview._id));
                toast.success('Review deleted successfully');
                setOpenDeleteModal(false);

                await dispatch(getUserReviews(user.id, currentPage, ITEMS_PER_PAGE, searchTerm, ratingFilter));
            } catch (err) {
                console.error('Failed to delete review:', err.message);
                toast.error('Failed to delete review');
            }
        }
    };

    const handlePageChangeLocal = (e, page) => {
        setPageChanging(true);
        setCurrentPage(page);
        dispatch(getUserReviews(user.id, page, ITEMS_PER_PAGE, searchTerm, ratingFilter)).finally(() => {
            setPageChanging(false);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const showEmptyState = () => {
        if (loading || pageChanging) return false;
        if (!Array.isArray(reviews) || reviews.length === 0) return true;
        return false;
    };

    const applyMargin = () => (reviews.length === 1 ? 'mb-40' : '');

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title="Reviews"
                    searchTerm={searchTerm}
                    setSearchTerm={handleSearchTermChange}
                    showSearch={showBars}
                    showFilter={showBars}
                    statusFilter={ratingFilter}
                    setStatusFilter={handleRatingFilterChange}
                    placeholder="Search reviews..."
                    filterType="reviews"
                />
                {loading || pageChanging ? (
                    <LoadingReviewItem />
                ) : showEmptyState() ? (
                    <EmptyState
                        imageSrc={emptyReviewsImage}
                        context="reviews"
                        items={reviews}
                        searchTerm={searchTerm}
                        statusFilter={ratingFilter}
                    />
                ) : (
                    <div className={`flex flex-col ${applyMargin()}`}>
                        <div className="grid gap-4 mb-3">
                            {reviews.map((review) => (
                                <ReviewItem
                                    key={review._id}
                                    review={review}
                                    onImageClick={handleImageClick}
                                    onMenuClick={handleMenuClick}
                                    onCardClick={handlePaperClick}
                                />
                            ))}
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-start sm:justify-start">
                                <CustomPagination
                                    count={pagination.totalPages}
                                    page={currentPage}
                                    onChange={handlePageChangeLocal}
                                    size="medium"
                                    sx={paginationSx}
                                />
                            </div>
                        )}
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