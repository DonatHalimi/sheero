import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculatePageCount, CustomPagination, EmptyState, getPaginatedItems, handlePageChange, Header, LoadingOrderItem, ProfileLayout } from '../../assets/CustomComponents';
import emptyReturnsImage from '../../assets/img/empty/orders.png';
import Navbar from '../../components/Navbar/Navbar';
import ReturnItem from '../../components/Product/Items/ReturnItem';
import Footer from '../../components/Utils/Footer';
import { getUserReturns } from '../../store/actions/returnActions';

const itemsPerPage = 8;

const Returns = () => {
    const { user } = useSelector((state) => state.auth);
    const { returns, loading } = useSelector((state) => state.returns);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        if (user?.id) {
            dispatch(getUserReturns(user.id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const filteredReturns = Array.isArray(returns)
        ? returns.filter(({ _id, reason, status, products }) => {
            const fields = [_id, reason, status, ...(Array.isArray(products) ? products.map(({ name }) => name?.toLowerCase()) : [products?.name?.toLowerCase()])];

            const matchesSearchTerm = fields.some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatusFilter = statusFilter === 'All' || status === statusFilter;
            return matchesSearchTerm && matchesStatusFilter;
        }) : [];

    const statusClasses = {
        pending: 'text-yellow-500',
        approved: 'text-blue-500',
        rejected: 'text-red-500',
        processed: 'text-green-500',
        default: 'text-gray-500'
    };

    const getStatusColor = (status) => `${statusClasses[status] || statusClasses.default} capitalize bg-stone-50 rounded-md px-1`;

    const applyMargin = () => {
        return (filteredReturns.length === 1 || currentPageItems.length === 1) ? 'mb-20' : '';
    };

    const pageCount = calculatePageCount(filteredReturns, itemsPerPage);
    const currentPageItems = getPaginatedItems(filteredReturns, currentPage, itemsPerPage);

    useEffect(() => {
        const newPageCount = calculatePageCount(returns, itemsPerPage);
        if (currentPage > newPageCount) {
            setCurrentPage(newPageCount > 0 ? newPageCount : 1);
        }
    }, [returns, currentPage]);

    return (
        <>
            <Navbar />
            <ProfileLayout>

                <Header
                    title="Returns"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showSearch={returns.length > 0}
                    showFilter={returns.length > 0}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    placeholder="Search returns..."
                    filterType="returns"
                />

                {loading ? (
                    <LoadingOrderItem />
                ) : filteredReturns.length === 0 ? (
                    <EmptyState
                        imageSrc={emptyReturnsImage}
                        context="returns"
                        items={returns}
                        searchTerm={searchTerm}
                        statusFilter={statusFilter}
                    />
                ) : (
                    <div className={`flex flex-col ${applyMargin()}`}>
                        <div className="grid gap-4 mb-3">
                            {currentPageItems.map(returnRequest => (
                                <ReturnItem
                                    key={returnRequest._id}
                                    returnRequest={returnRequest}
                                    getStatusColor={getStatusColor}
                                    products={returnRequest.products}
                                />
                            ))}
                        </div>

                        <div className="flex justify-start sm:justify-start">
                            <CustomPagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange(setCurrentPage)}
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
                    </div>
                )}
            </ProfileLayout>

            <Footer />
        </>
    );
};

export default Returns;