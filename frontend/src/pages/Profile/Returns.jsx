import React, { useEffect, useMemo, useState } from 'react';
import { calculatePageCount, CustomPagination, EmptyState, getPaginatedItems, handlePageChange, Header, LoadingOrderItem, ProfileLayout } from '../../assets/CustomComponents';
import emptyReturnsImage from '../../assets/img/empty/orders.png';
import useAxios from '../../axiosInstance';
import Navbar from '../../components/Navbar/Navbar';
import ReturnItem from '../../components/Product/Items/ReturnItem';
import Footer from '../../components/Utils/Footer';

const itemsPerPage = 4;

const Returns = () => {
    const axiosInstance = useMemo(() => useAxios(), []);

    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        const fetchReturns = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get('/auth/me');
                const userId = data.id;
                const returnsResponse = await axiosInstance.get(`/returns/user/${userId}`);
                setReturns(returnsResponse.data);
            } catch (error) {
                console.error('Error fetching returns:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReturns();
    }, [axiosInstance]);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const filteredReturns = Array.isArray(returns) ? returns.filter(returnRequest => {
        const matchesSearchTerm = [
            returnRequest._id || '',
            returnRequest.reason || '',
            returnRequest.status || '',
            ...(Array.isArray(returnRequest.products)
                ? returnRequest.products.map(product => product?.name?.toLowerCase() || '')
                : [returnRequest.products?.name?.toLowerCase() || ''])
        ].some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatusFilter = statusFilter === 'All' || returnRequest.status === statusFilter;

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
                        message={searchTerm ? "No returns found matching your search" : "No returns found!"}
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

            {filteredReturns.length === 1 && <div className="mb-48" />}
            <Footer />
        </>
    );
};

export default Returns;