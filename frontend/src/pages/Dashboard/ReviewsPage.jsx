import { RatingStars } from '../../components/custom/Product';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import ReviewDetailsDrawer from '../../components/Dashboard/Modal/Review/ReviewDetailsDrawer';
import ReviewForm from '../../components/Dashboard/Modal/Review/ReviewForm';
import { getReviews } from '../../store/actions/dashboardActions';

const ReviewsPage = () => {
    const itemsSelector = (state) => state.dashboard.reviews;
    const loadingSelector = (state) => state.dashboard.loadingReviews;

    const columns = [
        { key: 'user', label: 'User', render: (review) => `${review.user.firstName} ${review.user.lastName} - ${review.user.email}` },
        { key: 'product.name', label: 'Product' },
        { key: 'title', label: 'Title' },
        {
            key: 'rating',
            label: 'Rating',
            render: (review) => (
                <div style={{ position: 'relative', top: '20px' }}>
                    <RatingStars rating={review.rating} />
                </div>
            )
        },
        { key: 'comment', label: 'Comment', render: (review) => review.comment ? review.comment : 'N/A' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (review) => ({
        ...review,
        user: `${review.user.firstName} ${review.user.lastName} - ${review.user.email}`,
        product: review.product.name
    });

    return (
        <DashboardPage
            title="Reviews"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getReviews}
            entityName="review"
            FormComponent={ReviewForm}
            DetailsDrawerComponent={ReviewDetailsDrawer}
            transformFunction={handleExport}
            formItemProp="review"
            detailsItemProp="review"
        />
    );
};

export default ReviewsPage;