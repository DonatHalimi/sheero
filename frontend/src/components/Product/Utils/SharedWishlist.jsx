import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import emptyWishlistImage from '../../../assets/img/empty/wishlist.png';
import { LoadingProductItem } from '../../../components/custom/LoadingSkeletons';
import { CustomPagination, EmptyState } from '../../../components/custom/MUI';
import { Header } from '../../../components/custom/Profile';
import { getSharedUserWishlistService } from '../../../services/wishlistService';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Utils/Footer';
import ProductItem from '../Items/ProductItem';

const itemsPerPage = 12;

const SharedWishlist = () => {
    const { userId } = useParams();

    const [wishlistItems, setWishlistItems] = useState([]);
    const [fullName, setFullName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            setLoading(true);
            try {
                const { data } = await getSharedUserWishlistService(userId);
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
    }, [userId]);

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