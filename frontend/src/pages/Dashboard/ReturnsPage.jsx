import React from 'react';
import { RenderReturnStatus } from '../../assets/CustomComponents';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import ReturnDetailsDrawer from '../../components/Dashboard/Modal/ReturnRequest/ReturnDetailsDrawer';
import ReturnRequestForm from '../../components/Dashboard/Modal/ReturnRequest/ReturnRequestForm';
import { getReturnRequests } from '../../store/actions/dashboardActions';

const ReturnsPage = () => {
    const itemSelector = (state) => state.dashboard.returnRequests;
    const loadingSelector = (state) => state.dashboard.loadingReturns;

    const renderProducts = (products) => {
        return products.map(product => product.name).join(', ');
    };

    const formatUser = (returnRequest) => `${returnRequest.user.firstName} ${returnRequest.user.lastName} - ${returnRequest.user.email}`;

    const columns = [
        { key: 'id', label: 'Return ID' },
        { key: 'order', label: 'Order ID' },
        { key: 'user.email', label: 'User' },
        {
            key: 'products',
            label: 'Products',
            render: (returnRequest) => renderProducts(returnRequest.products),
        },
        { key: 'reason', label: 'Reason' },
        {
            key: 'status',
            label: 'Status',
            render: (returnRequest) => <RenderReturnStatus returnRequest={returnRequest} />,
        },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (returnRequest) => ({
        ...returnRequest,
        products: renderProducts(returnRequest.products),
        user: formatUser(returnRequest)
    });

    return (
        <DashboardPage
            title="Return Requests"
            columns={columns}
            itemsSelector={itemSelector}
            loadingSelector={loadingSelector}
            fetchAction={getReturnRequests}
            entityName="return"
            FormComponent={ReturnRequestForm}
            DetailsDrawerComponent={ReturnDetailsDrawer}
            formItemProp="returnRequest"
            detailsItemProp="returnRequest"
            transformFunction={handleExport}
            showAddButton={false}
        />
    );
};

export default ReturnsPage;