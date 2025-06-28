import { formatDate } from '../../components/custom/utils';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import SubscriptionDetailsDrawer from '../../components/Dashboard/Modal/Product/SubscriptionDetailsDrawer';
import { getProductRestockSubscriptions } from '../../store/actions/dashboardActions';
import { getImageUrl } from '../../utils/config/config';

const ProductRestockSubscriptionsPage = () => {
    const itemsSelector = (state) => state.dashboard.productRestockSubscriptions;
    const loadingSelector = (state) => state.dashboard.loadingProductRestockSubscriptions;

    const columns = [
        { key: 'productImage', label: 'Product Image', render: (item) => <img src={getImageUrl(item.productId.image)} alt={item.productId.name} width={70} className='rounded-md' /> },
        { key: 'productName', label: 'Product Name', render: (row) => row.productId?.name },
        { key: 'productInventory', label: 'Product Inventory', render: (row) => row.productId?.inventoryCount || 0 },
        { key: 'email', label: 'User Email' },
        { key: 'createdAt', label: 'Created At', render: (row) => formatDate(row.createdAt) },
        { key: 'actions', label: 'Actions' },
    ];

    const handleExport = (sub) => ({
        productId: sub.productId._id,
        productImage: sub.productId.image,
        productName: sub.productId.name,
        productInventory: sub.productId.inventoryCount,
        email: sub.email,
        createdAt: sub.createdAt,
    });

    return (
        <DashboardPage
            title="Product Restock Subscriptions"
            columns={columns}
            itemsSelector={itemsSelector}
            loadingSelector={loadingSelector}
            fetchAction={getProductRestockSubscriptions}
            entityName="subscription"
            DetailsDrawerComponent={SubscriptionDetailsDrawer}
            transformFunction={handleExport}
            detailsItemProp="subscription"
            showAddButton={false}
            showEditButton={false}
        />
    );
};

export default ProductRestockSubscriptionsPage;