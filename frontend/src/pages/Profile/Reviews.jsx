import { Box, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { CustomDeleteModal, CustomMenu, ReviewModal, SectionHeader } from '../../assets/CustomComponents';
import noReviewsImage from '../../assets/img/empty-reviews.png';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import EditReviewModal from '../../components/Product/EditReviewModal';
import ReviewItem from '../../components/Product/ReviewItem';
import { AuthContext } from '../../context/AuthContext';
import ProfileSidebar from './ProfileSidebar';

const apiUrl = 'http://localhost:5000/api/reviews';

const Reviews = () => {
    const { auth } = useContext(AuthContext);
    const userId = auth?.userId;
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (userId && auth.accessToken) {
            fetchReviews();
        }
    }, [userId, auth.accessToken]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/user/${userId}`, {
                headers: { Authorization: `Bearer ${auth.accessToken}` },
            });
            setReviews(response.data);
        } catch (err) {
            console.error('Failed to fetch reviews:', err.message);
        } finally {
            setLoading(false);
        }
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

    const handleEditSuccess = () => {
        fetchReviews();
        setOpenEditModal(false);
    };

    const handleDeleteConfirm = async () => {
        if (selectedReview) {
            try {
                await axios.delete(`${apiUrl}/delete/${selectedReview._id}`, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` },
                });
                fetchReviews();
            } catch (err) {
                console.error('Failed to delete review:', err.message);
            } finally {
                setOpenDeleteModal(false);
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

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex">
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className="container mx-auto max-w-6xl mt-20 mb-20">
                        <SectionHeader title='Reviews' />

                        <div className="rounded-sm mb-2">
                            {userId && auth.accessToken ? (
                                <ReviewItem
                                    reviews={reviews}
                                    loading={loading}
                                    onImageClick={handleImageClick}
                                    onMenuClick={handleMenuClick}
                                    onPaperClick={handlePaperClick}
                                    noReviewsImage={noReviewsImage}
                                />
                            ) : (
                                <Typography variant="body1">Please log in to view your reviews.</Typography>
                            )}
                        </div>
                    </div>
                </main>
            </Box>
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
        </>
    );
};

export default Reviews;