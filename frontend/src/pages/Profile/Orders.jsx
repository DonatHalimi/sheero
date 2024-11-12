import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { calculatePageCount, CustomPagination, EmptyState, getPaginatedItems, handlePageChange, Header, OrderItemSkeleton, ProfileLayout } from '../../assets/CustomComponents';
import emptyOrdersImage from '../../assets/img/empty/orders.png';
import { paginationSx } from '../../assets/sx';
import useAxios from '../../axiosInstance';
import Navbar from '../../components/Navbar/Navbar';
import OrderItem from '../../components/Product/Items/OrderItem';
import Footer from '../../components/Utils/Footer';
import { getImageUrl } from '../../config';

const itemsPerPage = 5;

const Orders = () => {
    const axiosInstance = useMemo(() => useAxios(), []);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get('/auth/me');
                const userId = data.id;
                const ordersResponse = await axiosInstance.get(`/orders/user/${userId}`);
                setOrders(ordersResponse.data);
            } catch (error) {
                console.error('Error fetching orders:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [axiosInstance]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
        const matchesSearchTerm = [
            order._id || '',
            order.paymentStatus || '',
            order.paymentMethod || '',
            order.totalAmount?.toString() || '',
            order.paymentIntentId || '',
            order.status || '',
            ...order.products.flatMap(product => [
                product.product?.name?.toLowerCase() || '',
                product.quantity?.toString() || '',
                product.price?.toString() || ''
            ])
        ].some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatusFilter = statusFilter === 'All' || order.status === statusFilter;

        return matchesSearchTerm && matchesStatusFilter;
    }) : [];

    const renderProductImages = (products) => {
        if (!Array.isArray(products)) return null;
        return products.map(product => {
            const { _id, image, name } = product.product || {};
            if (!_id || !image || !name) return null;
            return (
                <Link key={_id} to={`/product/${_id}`}>
                    <img
                        src={getImageUrl(image)}
                        alt={name}
                        className="w-20 h-20 object-contain rounded cursor-pointer"
                    />
                </Link>
            );
        });
    };

    const statusClasses = {
        pending: 'text-yellow-500',
        shipped: 'text-blue-400',
        delivered: 'text-green-500',
        canceled: 'text-red-500',
        default: 'text-gray-500'
    };

    const getStatusColor = (status) => `${statusClasses[status] || statusClasses.default} capitalize bg-stone-50 rounded-md px-1`;

    const pageCount = calculatePageCount(filteredOrders, itemsPerPage);
    const currentPageItems = getPaginatedItems(filteredOrders, currentPage, itemsPerPage);

    return (
        <>
            <Navbar />
            <ProfileLayout>

                <Header
                    title='Orders'
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showSearch={orders.length > 0}
                    showFilter={orders.length > 0}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    placeholder='Search orders...'
                />

                {loading ? (
                    <OrderItemSkeleton />
                ) : filteredOrders.length === 0 ? (
                    <EmptyState
                        imageSrc={emptyOrdersImage}
                        message={searchTerm ? "No orders found matching your search" : "No orders found!"}
                    />
                ) : (
                    <div className="flex flex-col">
                        <div className="grid gap-4 mb-3">
                            {currentPageItems.map(order => (
                                <OrderItem
                                    key={order._id}
                                    order={order}
                                    renderProductImages={renderProductImages}
                                    getStatusColor={getStatusColor}
                                />
                            ))}
                        </div>

                        <div className="flex justify-start sm:justify-start">
                            <CustomPagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange(setCurrentPage)}
                                size="medium"
                                sx={paginationSx}
                            />
                        </div>
                    </div>
                )}
            </ProfileLayout>

            {filteredOrders.length === 1 && <div className='mb-48' />}
            <Footer />
        </>
    );
};

export default Orders;