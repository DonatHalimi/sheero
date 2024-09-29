import React, { useContext, useEffect, useState } from 'react';
import { DashboardHeader } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal'; // Ensure this is imported
import EditOrderModal from '../../components/Modal/Order/EditOrderModal';
import { AuthContext } from '../../context/AuthContext';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [editOrderOpen, setEditOrderOpen] = useState(false);
    const [deleteOrderOpen, setDeleteOrderOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchOrders();
    }, [editOrderOpen, deleteOrderOpen, axiosInstance]);

    const fetchOrders = async () => {
        try {
            const response = await axiosInstance.get('/orders/get');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders', error);
        }
    };

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

    const columns = [
        { key: '_id', label: 'Order ID' },
        { key: 'user.email', label: 'User' },
        {
            key: 'products',
            label: 'Products',
            render: (order) => order.products.map((item) => item.product.name).join(', ')
        },
        {
            key: 'quantities',
            label: 'Quantities',
            render: (order) => order.products.map((item) => item.quantity).join(', ')
        },
        { key: 'totalAmount', label: 'Total Amount' },
        { key: 'paymentStatus', label: 'Payment Status' },
        { key: 'status', label: 'Delivery Status' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
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
                    containerClassName="max-w-full"
                />

                <EditOrderModal
                    open={editOrderOpen}
                    onClose={() => setEditOrderOpen(false)}
                    order={selectedOrder}
                    onEditSuccess={fetchOrders}
                />

                <DeleteModal
                    open={deleteOrderOpen}
                    onClose={() => setDeleteOrderOpen(false)}
                    items={selectedOrders.map(id => orders.find(order => order._id === id)).filter(order => order)}
                    onDeleteSuccess={fetchOrders}
                    endpoint="/orders/delete-bulk"
                    title="Delete Orders"
                    message="Are you sure you want to delete the selected orders?"
                />
            </div>
        </div>
    );
};

export default OrdersPage;