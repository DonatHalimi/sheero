import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { calculatePageCount, CustomDeleteModal, CustomMenu, CustomPagination, EmptyState, getPaginatedItems, handlePageChange, Header, LoadingOverlay, LoadingReviewItem, ProfileLayout, ReviewModal } from '../../assets/CustomComponents';
import emptyReviewsImage from '../../assets/img/empty/reviews.png';
import { paginationSx } from '../../assets/sx';
import useAxios from '../../axiosInstance';
import Navbar from '../../components/Navbar/Navbar';
import ReviewItem from '../../components/Product/Items/ReviewItem';
import EditReviewModal from '../../components/Product/Modals/EditReviewModal';
import Footer from '../../components/Utils/Footer';

const itemsPerPage = 4;

const Reviews = () => {
    const axiosInstance = useMemo(() => useAxios(), []);
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingOverlay, setLoadingOverlay] = useState(false);

    useEffect(() => { window.scrollTo(0, 0); }, [])

    useEffect(() => {
        fetchReviews();
    }, [axiosInstance]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get('/auth/me');
            const userId = data.id;
            const reviewsResponse = await axiosInstance.get(`/reviews/user/${userId}`);
            setReviews(reviewsResponse.data);
        } catch (error) {
            console.error('Error fetching reviews:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredReviews = reviews.filter(review => {
        const matchesSearchTerm = [
            review.product.name,
            review.title,
            review.rating,
            review.comment,
        ].some(field => field?.toString().toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearchTerm;
    });

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

    const handleDeleteClick = () => {
        setOpenDeleteModal(true);
        handleMenuClose();
    };

    const handleEditSuccess = async (updatedReview) => {
        setLoadingOverlay(true);
        setReviews(prevReviews =>
            prevReviews.map(review => (review._id === updatedReview._id ? updatedReview : review))
        );
        setOpenEditModal(false);
        await fetchReviews();
        setLoadingOverlay(false);
    };

    const handleDeleteConfirm = async () => {
        if (selectedReview) {
            setLoadingOverlay(true);
            setReviews(prevReviews => prevReviews.filter(review => review._id !== selectedReview._id));
            try {
                await axiosInstance.delete(`/reviews/delete/${selectedReview._id}`);
                await fetchReviews();
                toast.success('Review deleted successfully');
            } catch (err) {
                console.error('Failed to delete review:', err.message);
            } finally {
                setOpenDeleteModal(false);
                setLoadingOverlay(false);
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
        return (filteredReviews.length === 1 || currentPageItems.length === 1) ? 'mb-32' : '';
    };

    const pageCount = calculatePageCount(filteredReviews, itemsPerPage);
    const currentPageItems = getPaginatedItems(filteredReviews, currentPage, itemsPerPage);

    return (
        <>
            <Navbar />
            <ProfileLayout>

                <Header
                    title='Reviews'
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showSearch={reviews.length > 0}
                    placeholder='Search reviews...'
                />
                {loading ? (
                    <LoadingReviewItem />
                ) : filteredReviews.length === 0 ? (
                    <EmptyState
                        imageSrc={emptyReviewsImage}
                        message={searchTerm ? "No review found matching your search" : "No review found!"}
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

            {filteredReviews.length === 1 && <div className='mb-44' />}
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