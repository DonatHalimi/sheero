import { Box } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomDeleteModal, CustomMenu, CustomReviewCard, EmptyReviews, ReviewItemSkeleton, ReviewModal } from '../../assets/CustomComponents';
import { AuthContext } from '../../context/AuthContext';
import EditReviewModal from './EditReviewModal';

const apiUrl = 'http://localhost:5000/api/reviews';

const ReviewItem = ({ userId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedReview, setSelectedReview] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
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

    if (loading) {
        return (
            <Box>
                {Array.from({ length: 3 }).map((_, index) => (
                    <ReviewItemSkeleton key={index} />
                ))}
            </Box>
        );
    }

    return (
        <Box>
            {reviews.length === 0 ? (
                <EmptyReviews />
            ) : (
                reviews.map((review) => (
                    <CustomReviewCard
                        key={review._id}
                        review={review}
                        onImageClick={handleImageClick}
                        onMenuClick={(event) => handleMenuClick(event, review)}
                        onCardClick={() => handlePaperClick(review)}
                    />
                ))
            )}

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
        </Box>
    );
};

export default ReviewItem;