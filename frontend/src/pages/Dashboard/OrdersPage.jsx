import { RenderOrderDelStatus } from '../../components/custom/Adornments';
import { RenderOrderPaymentInfo, RenderOrderQuantity } from '../../components/custom/Dashboard';
import { formatAddress, formatArrivalDateRange, formatFullDate, formatProducts, formatQuantity, formatTotalAmount, formatUser } from '../../components/custom/utils';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import OrderDetailsDrawer from '../../components/Dashboard/Modal/Order/OrderDetailsDrawer';
import OrderForm from '../../components/Dashboard/Modal/Order/OrderForm';
import { getOrders } from '../../store/actions/dashboardActions';

const OrdersPage = () => {
    const itemSelector = (state) => state.dashboard.orders;
    const loadingSelector = (state) => state.dashboard.loadingOrders;

    const columns = [
        { key: '_id', label: 'Order ID' },
        { key: 'user.email', label: 'User' },
        { key: 'quantity', label: 'Quantity', render: RenderOrderQuantity },
        { key: 'totalAmount', label: 'Total Amount', render: formatTotalAmount },
        {
            key: 'paymentInfo',
            label: 'Payment Info',
            render: RenderOrderPaymentInfo,
        },
        { key: 'createdAt', label: 'Order Date', render: (order) => formatFullDate(order.createdAt, { dateOnly: true }) },
        {
            key: 'status',
            label: 'Delivery Status',
            render: (order) => <RenderOrderDelStatus order={order} />,
        },
        { key: 'actions', label: 'Actions' },
    ];

    const handleExport = (order) => ({
        ...order,
        arrivalDateRange: formatArrivalDateRange(order),
        user: formatUser(order),
        products: formatProducts(order),
        quantity: formatQuantity(order),
        totalAmount: formatTotalAmount(order),
        address: formatAddress(order)
    });

    return (
        <DashboardPage
            title="Orders"
            columns={columns}
            itemsSelector={itemSelector}
            loadingSelector={loadingSelector}
            fetchAction={getOrders}
            entityName="order"
            FormComponent={OrderForm}
            DetailsDrawerComponent={OrderDetailsDrawer}
            formItemProp="order"
            detailsItemProp="order"
            transformFunction={handleExport}
            showAddButton={false}
        />
    );
};

export default OrdersPage;