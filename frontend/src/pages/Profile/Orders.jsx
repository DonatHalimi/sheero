import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import emptyOrdersImage from '../../assets/img/empty/orders.png';
import { paginationSx } from '../../assets/sx';
import { LoadingOrderItem } from '../../components/custom/LoadingSkeletons';
import { CustomPagination, EmptyState } from '../../components/custom/MUI';
import { Header, ProfileLayout } from '../../components/custom/Profile';
import { getStatusColor } from '../../components/custom/utils';
import Navbar from '../../components/Navbar/Navbar';
import OrderItem from '../../components/Product/Items/OrderItem';
import Footer from '../../components/Utils/Footer';
import { ITEMS_PER_PAGE } from '../../services/orderService';
import { getUserOrders } from '../../store/actions/orderActions';

const Orders = () => {
    const { user } = useSelector((state) => state.auth);
    const { orders, pagination, loading } = useSelector((state) => state.orders);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [pageChanging, setPageChanging] = useState(false);

    const showBars = pagination.totalOrders > 0;

    const debouncedFetchOrders = useCallback(
        debounce((userId, page, limit, search, status) => {
            dispatch(getUserOrders(userId, page, limit, search, status)).finally(() => {
                setPageChanging(false);
            });
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (user?.id) {
            dispatch(getUserOrders(user.id, currentPage, ITEMS_PER_PAGE, searchTerm, statusFilter));
        }
    }, [dispatch, user, currentPage, statusFilter]);

    useEffect(() => {
        if (user?.id) {
            setCurrentPage(1);
            debouncedFetchOrders(user.id, 1, ITEMS_PER_PAGE, searchTerm, statusFilter);
        }
    }, [user?.id, searchTerm, debouncedFetchOrders, statusFilter]);

    const handleStatusFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        setCurrentPage(1);
    };

    const handleSearchTermChange = (newSearchTerm) => {
        setSearchTerm(newSearchTerm);
    };

    const handlePageChangeLocal = (e, page) => {
        setPageChanging(true);
        setCurrentPage(page);
        dispatch(getUserOrders(user.id, page, ITEMS_PER_PAGE, searchTerm, statusFilter))
            .finally(() => setPageChanging(false));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const showEmptyState = () => {
        if (loading || pageChanging) return false;
        if (!Array.isArray(orders) || orders.length === 0) return true;
        return false;
    };

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title='Orders'
                    searchTerm={searchTerm}
                    setSearchTerm={handleSearchTermChange}
                    showSearch={showBars}
                    showFilter={showBars}
                    statusFilter={statusFilter}
                    setStatusFilter={handleStatusFilterChange}
                    placeholder='Search orders...'
                />

                {loading || pageChanging ? (
                    <LoadingOrderItem length={ITEMS_PER_PAGE} />
                ) : showEmptyState() ? (
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
                            {orders.map(order => (
                                <OrderItem
                                    key={order._id}
                                    order={order}
                                    getStatusColor={(status) => getStatusColor(status, 'order')}
                                />
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="flex justify-start sm:justify-start">
                                <CustomPagination
                                    count={pagination.totalPages}
                                    page={currentPage}
                                    onChange={handlePageChangeLocal}
                                    size="medium"
                                    sx={paginationSx}
                                />
                            </div>
                        )}
                    </div>
                )}
            </ProfileLayout>

            <Footer />
        </>
    );
};

export default Orders;