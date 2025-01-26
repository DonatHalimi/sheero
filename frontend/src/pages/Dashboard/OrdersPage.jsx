import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, formatDate, LoadingDataGrid } from '../../assets/CustomComponents';
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
    const [deleteOrderOpen, setDeleteOrderOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(getOrders());
    }, [dispatch]);

    const handleSelectOrder = (orderId) => {
        const id = Array.isArray(orderId) ? orderId[0] : orderId;

        setSelectedOrders((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        setSelectedOrders(e.target.checked ? orders.map(order => order._id) : []);
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

    const getSelectedOrders = () => {
        return selectedOrders
            .map((id) => orders.find((order) => order._id === id))
            .filter((order) => order);
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

    const columns = [
        { key: '_id', label: 'Order ID' },
        { key: 'user.email', label: 'User' },
        {
            key: 'products',
            label: 'Products',
            render: (order) => order.products.map((item) => item.product.name).join(', ')
        },
        {
            key: 'quantity',
            label: 'Quantity',
            render: (order) => order.products.map((item) => item.quantity).join(', ')
        },
        { key: 'totalAmount', label: 'Total Amount' },
        {
            key: 'paymentInfo',
            label: 'Payment Info',
            render: (order) => {
                const paymentMethod = order.paymentMethod || 'N/A';
                const paymentStatus = order.paymentStatus || 'N/A';
                return `${paymentMethod} - ${paymentStatus}`;
            }
        },
        {
            key: 'arrivalDateRange',
            label: 'Delivery Date',
            render: (order) => {
                const startDate = formatDate(order.arrivalDateRange.start);
                const endDate = formatDate(order.arrivalDateRange.end);
                return `${startDate} - ${endDate}`;
            }
        },
        { key: 'status', label: 'Delivery Status' },
        { key: 'actions', label: 'Actions' }
    ];

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
                            setDeleteItemOpen={setDeleteOrderOpen}
                            itemName="Order"
                        />

                        <DashboardTable
                            columns={columns}
                            data={orders}
                            selectedItems={selectedOrders}
                            onSelectItem={handleSelectOrder}
                            onSelectAll={handleSelectAll}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageClick}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                        />
                    </>
                )}

                <EditOrderModal open={editOrderOpen} onClose={() => setEditOrderOpen(false)} order={selectedOrder} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getOrders())} />
                <OrderDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} order={selectedOrder} onEdit={handleEditFromDrawer} />
                <DeleteModal
                    open={deleteOrderOpen}
                    onClose={() => setDeleteOrderOpen(false)}
                    items={getSelectedOrders()}
                    onDeleteSuccess={handleDeleteSuccess}
                    endpoint="/orders/delete-bulk"
                    title="Delete Orders"
                    message="Are you sure you want to delete the selected orders?"
                />
            </div>
        </div>
    );
};

export default OrdersPage;