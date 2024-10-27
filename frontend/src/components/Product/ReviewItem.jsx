import { Box, Typography } from '@mui/material';
import React from 'react';
import { CenteredMoreVertIcon, RatingStars, truncateText } from '../../assets/CustomComponents';
import { getImageUrl } from '../../config';

const ReviewItem = ({ review, onImageClick, onMenuClick, onCardClick }) => {
    return (
        <div
            className="p-3 mb-4 shadow-md flex relative cursor-pointer bg-white rounded-md flex-col sm:flex-row"
            onClick={() => onCardClick(review)}
            style={{ height: 'auto', minHeight: '120px' }}
        >
            <Box
                className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4"
                sx={{
                    width: '90px',
                    height: '90px',
                    overflow: 'hidden',
                }}
            >
                <img
                    src={getImageUrl(review.product.image)}
                    alt={review.product.name}
                    onClick={(event) => {
                        event.stopPropagation();
                        onImageClick(review.product._id);
                    }}
                    className="object-contain w-full h-full rounded-md cursor-pointer hover:underline"
                />
            </Box>
            <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography
                        onClick={(event) => {
                            event.stopPropagation();
                            onImageClick(review.product._id);
                        }}
                        variant="h6"
                        className="font-light mb-2 flex items-center hover:underline break-words"
                    >
                        {truncateText(review.product.name, 30)}
                        <Box className="ml-2">
                            <RatingStars rating={review.rating} />
                        </Box>
                    </Typography>
                    <p className="text-base font-semibold break-words">
                        {truncateText(review.title, 70)}
                    </p>
                    <div className="mt-1 text-gray-700 break-words">
                        <Typography variant="body1" className="break-words">
                            {truncateText(review.comment, 70)}
                        </Typography>
                    </div>
                    <Typography variant="caption" className="block mt-2 text-sm text-gray-500">
                        {new Date(review.updatedAt || review.createdAt).toLocaleDateString()}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        zIndex: 1
                    }}
                    onClick={(event) => onMenuClick(event, review)}
                >
                    <CenteredMoreVertIcon />
                </Box>
            </Box>
        </div>
    );
};

export default ReviewItem;