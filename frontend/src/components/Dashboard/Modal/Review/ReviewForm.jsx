import { FormControl, InputLabel, MenuItem, Rating, Select } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CustomBox, CustomModal, CustomTextField, CustomTypography, FormSubmitButtons } from '../../../../assets/CustomComponents';
import { addReviewService, editReviewService, getProductNamesService, getReviewsService } from '../../../../services/reviewService';
import { initialValues, validationSchema } from '../../../../utils/validations/review';

const ReviewForm = ({
    open,
    onClose,
    review = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const [products, setProducts] = useState([]);
    const [userReviews, setUserReviews] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProductNamesService();
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products', error);
            }
        };

        const fetchUserReviews = async () => {
            try {
                const response = await getReviewsService();
                setUserReviews(response.data);
            } catch (error) {
                console.error('Error fetching user reviews', error);
            }
        };

        fetchProducts();
        fetchUserReviews();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        // Check if the user has already reviewed this product
        if (!isEdit && userReviews.some(review => review.product === values.product)) {
            toast.error('You have already reviewed this product');
            setSubmitting(false);
            return;
        }

        try {
            let response;

            if (isEdit) {
                response = await editReviewService(review._id, values);
            } else {
                response = await addReviewService(values.product, values);
            }
            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                error.response.data.errors.forEach(err => {
                    toast.error(err.message);
                });
            } else {
                const errorMessage = isEdit ? 'Error updating review' : 'Error adding review';
                toast.error(errorMessage);
            }
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5"> {isEdit ? 'Edit Review' : 'Add Review'}</CustomTypography>

                <Formik
                    initialValues={initialValues(review)}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ values, isValid, dirty, setFieldValue, submitForm, isSubmitting }) => {
                        const isDisabled = !isValid || !dirty || isSubmitting;

                        return (
                            <Form>
                                <FormControl fullWidth className='!mb-4'>
                                    <InputLabel id="product-label">Product</InputLabel>
                                    <Select
                                        labelId="product-label"
                                        value={values.product}
                                        onChange={(e) => setFieldValue("product", e.target.value)}
                                    >
                                        {products.map((product) => (
                                            <MenuItem key={product._id} value={product._id}>
                                                {product.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <CustomTextField name="title" label="Title" />

                                <Rating
                                    name="rating"
                                    value={values.rating}
                                    onChange={(event, newValue) => setFieldValue("rating", newValue)}
                                    precision={1}
                                    max={5}
                                    min={1}
                                    size="large"
                                    sx={{ color: '#6D4C41', '& .MuiRating-iconFilled': { color: '#5A504B' }, '& .MuiRating-iconEmpty': { color: '#D7CCC8' } }}
                                    className='mb-4'
                                />

                                <CustomTextField name="comment" label="Comment" multiline rows={4} />

                                <FormSubmitButtons
                                    isEdit={isEdit}
                                    onViewDetails={onViewDetails}
                                    submitForm={submitForm}
                                    isDisabled={isDisabled}
                                    loading={isSubmitting}
                                    item={review}
                                    onClose={onClose}
                                />
                            </Form>
                        );
                    }}
                </Formik>
            </CustomBox>
        </CustomModal>
    );
};

export default ReviewForm;