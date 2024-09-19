import { Box } from '@mui/material';
import React from 'react';
import { CustomReviewCard, EmptyState, ReviewItemSkeleton } from '../../assets/CustomComponents';

const ReviewItem = ({ reviews, loading, onImageClick, onMenuClick, onPaperClick, noReviewsImage }) => {
    if (loading) {
        return (
            <Box>
                {Array.from({ length: 3 }).map((_, index) => (
                    <ReviewItemSkeleton key={index} />
                ))}
            </Box>
        );
    }

    if (reviews.length === 0) {
        return (
            <EmptyState
                imageSrc={noReviewsImage}
                message="No reviews available!"
            />
        );
    }

    return (
        <Box>
            {reviews.map((review) => (
                <CustomReviewCard
                    key={review._id}
                    review={review}
                    onImageClick={onImageClick}
                    onMenuClick={(event) => onMenuClick(event, review)}
                    onCardClick={() => onPaperClick(review)}
                />
            ))}
        </Box>
    );
};

export default ReviewItem;