import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CustomPagination, EmptyState, Header, ProductItemSkeleton } from '../../assets/CustomComponents';
import emptyWishlistImage from '../../assets/img/empty-wishlist.png';
import useAxios from '../../axiosInstance';
import { getApiUrl } from '../../config';
import Footer from '../Footer';
import Navbar from '../Navbar/Navbar';
import ProductItem from './ProductItem';

const itemsPerPage = 10; ``

const SharedWishlist = () => {
    const axiosInstance = useAxios();

    const [wishlistItems, setWishlistItems] = useState([]);
    const [fullName, setFullName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            setLoading(true);
            try {
                const userResponse = await axiosInstance.get(getApiUrl('/auth/me'));
                const userId = userResponse.data.id;

                const { data } = await axiosInstance.get(getApiUrl(`/wishlist/${userId}`));
                setWishlistItems(data.items);
                setFullName(`${data.firstName} ${data.lastName}`);
                setTotalItems(data.items.length);
            } catch (error) {
                console.error('Error fetching shared wishlist:', error);
                toast.error('Failed to load wishlist.');
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const pageCount = Math.ceil(totalItems / itemsPerPage);
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return wishlistItems.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 mb-16 bg-gray-50">
                <Header fullName={fullName} />

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(3)].map((_, index) => <ProductItemSkeleton key={index} />)}
                    </div>
                ) : wishlistItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {getCurrentPageItems().map((item) => (
                                <ProductItem
                                    key={item.product._id}
                                    product={item.product}
                                />
                            ))}
                        </div>
                        <CustomPagination
                            count={pageCount}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptyState imageSrc={emptyWishlistImage} message={`No item in ${fullName}'s wishlist.`} />
                )}
            </div>
            <Footer />
        </>
    );
};

export default SharedWishlist;