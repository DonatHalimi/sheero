import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import emptyOrdersImage from '../../assets/img/empty/orders.png';
import { paginationSx } from '../../assets/sx';
import { LoadingOrderItem } from '../../components/custom/LoadingSkeletons';
import { CustomPagination, EmptyState } from '../../components/custom/MUI';
import { Header, ProfileLayout } from '../../components/custom/Profile';
import { calculatePageCount, getPaginatedItems, handlePageChange } from '../../components/custom/utils';
import Navbar from '../../components/Navbar/Navbar';
import OrderItem from '../../components/Product/Items/OrderItem';
import Footer from '../../components/Utils/Footer';
import { getUserOrders } from '../../store/actions/orderActions';
import { getImageUrl } from '../../utils/config';

const itemsPerPage = 8;

const Orders = () => {
    const { user } = useSelector((state) => state.auth);
    const { orders, loading } = useSelector((state) => state.orders);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

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
            const { _id, image, name, slug } = product.product || {};
            if (!_id || !image || !name || !slug) return null;
            return (
                <Link key={_id} to={`/${slug}`}>
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
        processed: 'text-cyan-500',
        shipped: 'text-blue-700',
        delivered: 'text-green-500',
        canceled: 'text-red-500',
        default: 'text-gray-500'
    };

    const getStatusColor = (status) => `${statusClasses[status] || statusClasses.default} capitalize bg-stone-50 rounded-md px-1`;

    const pageCount = calculatePageCount(filteredOrders, itemsPerPage);
    const currentPageItems = getPaginatedItems(filteredOrders, currentPage, itemsPerPage);

    useEffect(() => {
        const newPageCount = calculatePageCount(orders, itemsPerPage);
        if (currentPage > newPageCount) {
            setCurrentPage(newPageCount > 0 ? newPageCount : 1);
        }
    }, [orders, currentPage]);

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
                        context="orders"
                        items={orders}
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
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

            <Footer />
        </>
    );
};

export default Orders;