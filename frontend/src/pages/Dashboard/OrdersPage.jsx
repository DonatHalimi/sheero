import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, exportOptions, formatAddress, formatArrivalDateRange, formatProducts, formatQuantity, formatTotalAmount, formatUser, LoadingDataGrid, RenderOrderDelStatus, RenderOrderPaymentInfo } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import EditOrderModal from '../../components/Modal/Order/EditOrderModal';
import OrderDetailsDrawer from '../../components/Modal/Order/OrderDetailsDrawer';
import { getOrders } from '../../store/actions/dashboardActions';

const OrdersPage = () => {
    const { orders, loadingOrders } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [editOrderOpen, setEditOrderOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(getOrders());
    }, [dispatch]);

    const handleSelectOrder = (newSelection) => {
        setSelectedOrders(newSelection);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const handleEdit = (order) => {
        setSelectedOrder(order);
        setEditOrderOpen(true);
    };

    const handleEditFromDrawer = (order) => {
        setViewDetailsOpen(false);
        setSelectedOrder(order);
        setEditOrderOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getOrders());
        setSelectedOrders([]);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedOrder(null);
    };

    const handleBulkDelete = () => {
        if (selectedOrders.length > 0) {
            setDeletionContext({
                endpoint: '/orders/delete-bulk',
                data: { ids: selectedOrders },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (order) => {
        setDeletionContext({
            endpoint: `/orders/delete/${order._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { key: '_id', label: 'Order ID' },
        { key: 'user.email', label: 'User' },
        { key: 'products', label: 'Products', render: formatProducts },
        { key: 'quantity', label: 'Quantity', render: formatQuantity },
        { key: 'totalAmount', label: 'Total Amount', render: formatTotalAmount },
        {
            key: 'paymentInfo',
            label: 'Payment Info',
            render: RenderOrderPaymentInfo,
        },
        { key: 'arrivalDateRange', label: 'Delivery Date', render: formatArrivalDateRange },
        {
            key: 'status',
            label: 'Delivery Status',
            render: (order) => <RenderOrderDelStatus order={order} />,
        },
        { key: 'actions', label: 'Actions' },
    ];

    const handleExport = (data, format) => {
        const flattenedOrders = data.map(order => ({
            ...order,
            arrivalDateRange: formatArrivalDateRange(order),
            user: formatUser(order),
            products: formatProducts(order),
            quantity: formatQuantity(order),
            totalAmount: formatTotalAmount(order),
            address: formatAddress(order)
        }));

        format === 'excel' ? exportToExcel(flattenedOrders, 'orders_data') : exportToJSON(data, 'orders_data');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loadingOrders ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Orders"
                            selectedItems={selectedOrders}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Order"
                            exportOptions={exportOptions(orders, handleExport)}
                            showAddButton={false}
                        />

                        <DashboardTable
                            columns={columns}
                            data={orders}
                            selectedItems={selectedOrders}
                            onSelectItem={handleSelectOrder}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <EditOrderModal open={editOrderOpen} onClose={() => setEditOrderOpen(false)} order={selectedOrder} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getOrders())} />
                <OrderDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} order={selectedOrder} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Orders' : 'Delete Order'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected orders?'
                        : 'Are you sure you want to delete this order?'
                    }
                />
            </div>
        </div>
    );
};

export default OrdersPage;