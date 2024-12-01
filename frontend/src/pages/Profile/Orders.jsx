import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { calculatePageCount, CustomPagination, EmptyState, getPaginatedItems, handlePageChange, Header, LoadingOrderItem, ProfileLayout } from '../../assets/CustomComponents';
import emptyOrdersImage from '../../assets/img/empty/orders.png';
import { paginationSx } from '../../assets/sx';
import Navbar from '../../components/Navbar/Navbar';
import OrderItem from '../../components/Product/Items/OrderItem';
import Footer from '../../components/Utils/Footer';
import { getImageUrl } from '../../config';
import { getUserOrders } from '../../store/actions/orderActions';

const itemsPerPage = 5;

const Orders = () => {
    const { user } = useSelector((state) => state.auth);
    const { orders, loading } = useSelector((state) => state.orders);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => { window.scrollTo(0, 0) }, []);

    useEffect(() => {
        if (user?.id) {
            dispatch(getUserOrders(user.id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const filteredOrders = Array.isArray(orders)
        ? orders.filter(
            ({ _id, paymentStatus, paymentMethod, totalAmount, paymentIntentId, status, products }) => {
                const fields = [
                    _id,
                    paymentStatus,
                    paymentMethod,
                    totalAmount?.toString(),
                    paymentIntentId,
                    status,
                    ...products.flatMap(({ product }) => [
                        product?.name?.toLowerCase(),
                        product?.quantity?.toString(),
                        product?.price?.toString(),
                    ]),
                ];

                const matchesSearchTerm = fields.some((field) =>
                    field?.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const matchesStatusFilter = statusFilter === 'All' || status === statusFilter;

                return matchesSearchTerm && matchesStatusFilter;
            }
        ) : [];

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
                    <LoadingOrderItem />
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