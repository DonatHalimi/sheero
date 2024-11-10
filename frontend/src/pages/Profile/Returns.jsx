import React, { useEffect, useMemo, useState } from 'react';
import { CustomPagination, EmptyState, Header, OrderItemSkeleton, ProfileLayout } from '../../assets/CustomComponents';
import emptyReturnsImage from '../../assets/img/empty/orders.png';
import useAxios from '../../axiosInstance';
import Navbar from '../../components/Navbar/Navbar';
import ReturnItem from '../../components/Product/ReturnItem';
import Footer from '../../components/Utils/Footer';

const itemsPerPage = 5;

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

    const totalReturns = filteredReturns.length;
    const pageCount = Math.ceil(totalReturns / itemsPerPage);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredReturns.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        window.scrollTo(0, 0);
    };

    const statusClasses = {
        pending: 'text-yellow-500',
        approved: 'text-green-500',
        rejected: 'text-red-500',
        default: 'text-gray-500'
    };

    const getStatusColor = (status) => `${statusClasses[status] || statusClasses.default} capitalize bg-stone-50 rounded-md px-1`;

    return (
        <>
            <Navbar />
            <ProfileLayout>

                <Header
                    title="Returns"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showSearch={filteredReturns.length > 0}
                    showFilter={returns.length > 0}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    placeholder="Search returns..."
                    filterType="returns"
                />

                {loading ? (
                    <OrderItemSkeleton />
                ) : filteredReturns.length === 0 ? (
                    <EmptyState
                        imageSrc={emptyReturnsImage}
                        message={searchTerm ? "No returns found matching your search" : "No returns found!"}
                    />
                ) : (
                    <div className="flex flex-col">
                        <div className="grid gap-4 mb-3">
                            {getCurrentPageItems().map(returnRequest => (
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
                                onChange={handlePageChange}
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

            {totalReturns === 1 && <div className="mb-48" />}
            <Footer />
        </>
    );
};

export default Returns;