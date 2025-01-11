import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CustomPagination, EmptyState, Header, LoadingProductItem } from '../../../assets/CustomComponents';
import emptyWishlistImage from '../../../assets/img/empty/wishlist.png';
import useAxios from '../../../utils/axiosInstance';
import { getApiUrl } from '../../../utils/config';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Utils/Footer';
import ProductItem from '../Items/ProductItem';

const itemsPerPage = 10;

const SharedWishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [fullName, setFullName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    const axiosInstance = useAxios();

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
            <div className="container mx-auto px-4 py-8 mb-16 mt-32 md:mt-0 bg-gray-50">
                <Header fullName={fullName} loading={loading} />

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <LoadingProductItem />
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