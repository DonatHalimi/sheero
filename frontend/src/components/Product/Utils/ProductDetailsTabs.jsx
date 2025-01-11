import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DetailsBox, ProductTabs, ReviewModal, ReviewsList, TabPanel } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const ProductDetailsTabs = ({ product }) => {
  const [value, setValue] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [open, setOpen] = useState(false);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/reviews/products/${product._id}`);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    fetchReviews();
  }, [product._id, axiosInstance]);

  const handleChange = (event, newValue) => setValue(newValue);

  const handleOpenModal = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedReview(null);
  };

  const { description, details } = product;
  const noDetailsMessage = 'The details are being processed. In the meantime, you can view the technical specifications. Thank you for your patience.';

  return (
    <DetailsBox>
      <ProductTabs value={value} handleChange={handleChange} />

      <TabPanel value={value} index={0}>
        <Typography>{description}</Typography>
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
          <Typography>{noDetailsMessage}</Typography>
        )}
      </TabPanel>

      <TabPanel value={value} index={2}>
        <ReviewsList reviews={reviews} openModal={handleOpenModal} />
      </TabPanel>

      <ReviewModal open={open} handleClose={handleCloseModal} selectedReview={selectedReview} />
    </DetailsBox>
  );
};

export default ProductDetailsTabs;