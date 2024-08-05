import { Box, Tabs, Typography, Modal, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { CustomTab, RatingStars, ReviewCard } from '../assets/CustomComponents';
import useAxios from '../axiosInstance';

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const ProductDetailsTabs = ({ product }) => {
  const [value, setValue] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [open, setOpen] = useState(false);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/reviews/products/${product._id}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    fetchReviews();
  }, [product._id, axiosInstance]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenModal = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedReview(null);
  };

  const { description, details } = product;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="product details tabs"
          sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <CustomTab label="Description" />
          <CustomTab label="Details" />
          <CustomTab label="Reviews" />
        </Tabs>
      </div>
      <TabPanel value={value} index={0}>
        <p>{description}</p>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {details.length > 0 ? (
          <div className="space-y-2">
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-semibold">{detail.attribute}:</span>
                <span>{detail.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <Typography>The details are being processed, in the meantime you can view the technical specifications, or contact us via email for further details. Thank you for your understanding.</Typography>
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <ReviewCard
                key={index}
                onClick={() => handleOpenModal(review)}
                style={{
                  cursor: 'pointer',
                  overflow: open ? 'visible' : 'hidden',
                }}
              >
                <Box className="flex justify-between items-center mb-2">
                  <p className='font-semibold text-lg'>{review.user.username}</p>
                  <RatingStars rating={review.rating} />
                </Box>
                <p className="my-2" style={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {review.comment}
                </p>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </ReviewCard>
            ))
          ) : (
            <Typography>No reviews found.</Typography>
          )}
        </Box>
      </TabPanel>

      {/* Modal for displaying the selected review */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="review-modal-title"
        aria-describedby="review-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70%',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          borderRadius: '8px',
          boxShadow: 24,
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1
          }}>
            <Box>
              {selectedReview && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(selectedReview.createdAt).toLocaleDateString()}
                </Typography>
              )}
              <Box display="flex" alignItems="center">
                <Typography id="review-modal-title" variant="h6" component="h2" mr={1}>
                  {selectedReview?.user.username}
                </Typography>
                {selectedReview && <RatingStars rating={selectedReview.rating} />}
              </Box>
            </Box>
            <IconButton
              onClick={handleCloseModal}
              aria-label="close"
              sx={{ ml: 'auto', mt: -1, mr: -1 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {selectedReview && (
            <Typography id="review-modal-description" >
              {selectedReview.comment}
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductDetailsTabs;
