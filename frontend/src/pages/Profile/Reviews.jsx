import { Box, Typography } from '@mui/material';
import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomDeleteModal, CustomMenu, CustomPagination, EmptyState, Header, LoadingOverlay, ReviewItemSkeleton, ReviewModal } from '../../assets/CustomComponents';
import emptyReviewsImage from '../../assets/img/empty-reviews.png';
import useAxios from '../../axiosInstance';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import EditReviewModal from '../../components/Product/EditReviewModal';
import ReviewItem from '../../components/Product/ReviewItem';
import ProfileSidebar from './ProfileSidebar';

const itemsPerPage = 4;

const Reviews = () => {
    const axiosInstance = useMemo(() => useAxios(), []);
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
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

        fetchReviews();
        window.scrollTo(0, 0);
    }, [axiosInstance]);

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

    const totalReviews = filteredReviews.length;
    const pageCount = Math.ceil(totalReviews / itemsPerPage);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
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

    const marginBottomClass = filteredReviews.length === 1 ? 'mb-[103px]' : 'mb-20';

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-5xl relative mb-16" style={{ paddingLeft: '77px' }}>
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className={`container mx-auto max-w-6xl mt-20 ${marginBottomClass}`}>
                        <Header
                            title='Reviews'
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            showSearch={filteredReviews.length > 0}
                            placeholder='Search reviews...'
                        />
                        <div className="rounded-sm mb-2">
                            {loading ? (
                                <ReviewItemSkeleton />
                            ) : (
                                filteredReviews.length === 0 ? (
                                    <EmptyState
                                        imageSrc={emptyReviewsImage}
                                        message={searchTerm ? "No review found matching your search" : "No review found!"}
                                    />
                                ) : (
                                    <>
                                        {getCurrentPageItems().map((review) => (
                                            <ReviewItem
                                                key={review._id}
                                                review={review}
                                                onImageClick={handleImageClick}
                                                onMenuClick={handleMenuClick}
                                                onCardClick={handlePaperClick}
                                            />
                                        ))}
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}>
                                            <CustomPagination
                                                count={pageCount}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                size="large"
                                                sx={{
                                                    position: 'relative',
                                                    bottom: '16px',
                                                    '& .MuiPagination-ul': {
                                                        justifyContent: 'flex-start',
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </main>
            </Box>

            {totalReviews === 1 && <div className='mb-32' />}
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