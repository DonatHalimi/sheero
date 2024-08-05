import { Box, Tabs, Typography } from '@mui/material';
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
        <Typography>{description}</Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {details.length > 0 ? (
          <ul>
            {details.map((detail, index) => (
              <li key={index}>
                <strong>{detail.attribute}:</strong> {detail.value}
              </li>
            ))}
          </ul>
        ) : (
          <Typography>Details are being worked on.</Typography>
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 2,
          }}
        >
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <ReviewCard key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">{review.user.username}</Typography>
                  <RatingStars rating={review.rating} />
                </Box>
                <Typography variant="body1" sx={{ my: 1 }}>
                  {review.comment}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </ReviewCard>
            ))
          ) : (
            <Typography>No reviews found.</Typography>
          )}
        </Box>
      </TabPanel>
    </Box>
  );
};

export default ProductDetailsTabs;
