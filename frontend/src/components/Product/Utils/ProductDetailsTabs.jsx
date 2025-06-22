import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ProductDetailsBox } from '../../../components/custom/MUI';
import { ProductTabs, ReviewModal, ReviewsList, TabPanel } from '../../../components/custom/Product';
import { getProductReviewsService } from '../../../services/reviewService';

const ProductDetailsTabs = ({ product }) => {
  const [value, setValue] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getProductReviews = async () => {
      try {
        const response = await getProductReviewsService(product._id);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    getProductReviews();
  }, [product._id]);

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
    <ProductDetailsBox>
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
    </ProductDetailsBox>
  );
};

export default ProductDetailsTabs;