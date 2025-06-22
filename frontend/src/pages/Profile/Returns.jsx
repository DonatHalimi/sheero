import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import emptyReturnsImage from '../../assets/img/empty/orders.png';
import { LoadingOrderItem } from '../../components/custom/LoadingSkeletons';
import { CustomPagination, EmptyState } from '../../components/custom/MUI';
import { Header, ProfileLayout } from '../../components/custom/Profile';
import { getStatusColor } from '../../components/custom/utils';
import Navbar from '../../components/Navbar/Navbar';
import ReturnItem from '../../components/Product/Items/ReturnItem';
import Footer from '../../components/Utils/Footer';
import { ITEMS_PER_PAGE } from '../../services/returnService';
import { getUserReturns } from '../../store/actions/returnActions';

const Returns = () => {
    const { user } = useSelector((state) => state.auth);
    const { returns, pagination, loading } = useSelector((state) => state.returns);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [pageChanging, setPageChanging] = useState(false);

    const showBars = pagination.totalReturns > 0;

    const debouncedFetchReturns = useCallback(
        debounce((userId, page, limit, search, status) => {
            dispatch(getUserReturns(userId, page, limit, search, status)).finally(() => {
                setPageChanging(false);
            });
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (user?.id) {
            dispatch(getUserReturns(user.id, currentPage, ITEMS_PER_PAGE, searchTerm, statusFilter))
        }
    }, [dispatch, user, currentPage, statusFilter]);

    useEffect(() => {
        if (user?.id) {
            setCurrentPage(1);
            debouncedFetchReturns(user.id, 1, ITEMS_PER_PAGE, searchTerm, statusFilter);
        }
    }, [user?.id, searchTerm, debouncedFetchReturns, statusFilter]);

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
        dispatch(getUserReturns(user.id, page, ITEMS_PER_PAGE, searchTerm, statusFilter))
            .finally(() => setPageChanging(false));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const showEmptyState = () => {
        if (loading || pageChanging) return false;
        if (!Array.isArray(returns) || returns.length === 0) return true;
        return false;
    };

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title="Return Requests"
                    searchTerm={searchTerm}
                    setSearchTerm={handleSearchTermChange}
                    showSearch={showBars}
                    showFilter={showBars}
                    statusFilter={statusFilter}
                    setStatusFilter={handleStatusFilterChange}
                    placeholder="Search returns..."
                    filterType="returns"
                />

                {loading || pageChanging ? (
                    <LoadingOrderItem length={ITEMS_PER_PAGE} />
                ) : showEmptyState() ? (
                    <EmptyState
                        imageSrc={emptyReturnsImage}
                        context="returns"
                        items={returns}
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                    />
                ) : (
                    <div className="flex flex-col">
                        <div className="grid gap-4 mb-3">
                            {returns.map(returnRequest => (
                                <ReturnItem
                                    key={returnRequest._id}
                                    returnRequest={returnRequest}
                                    getStatusColor={(status) => getStatusColor(status, 'return')}
                                    products={returnRequest.products}
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
                                    sx={{
                                        position: 'relative',
                                        bottom: '4px',
                                        '& .MuiPagination-ul': {
                                            justifyContent: 'flex-start',
                                        },
                                    }}
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

export default Returns;