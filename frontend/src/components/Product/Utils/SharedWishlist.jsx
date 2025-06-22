import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import emptyWishlistImage from '../../../assets/img/empty/wishlist.png';
import { LoadingProductItem } from '../../../components/custom/LoadingSkeletons';
import { CustomPagination, EmptyState } from '../../../components/custom/MUI';
import { Header } from '../../../components/custom/Profile';
import { bulkAddWishlistToCartService, getSharedUserWishlistService, SHARED_WISHLIST_ITEMS_PER_PAGE } from '../../../services/wishlistService';
import { getCartCount } from '../../../store/actions/cartActions';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Utils/Footer';
import ProductItem from '../Items/ProductItem';

const SharedWishlist = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();

    const [wishlistItems, setWishlistItems] = useState([]);
    const [fullName, setFullName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });
    const [loading, setLoading] = useState(true);
    const [pageChanging, setPageChanging] = useState(false);
    const [bulkAddLoading, setBulkAddLoading] = useState(false);

    const fetchWishlist = async (page = 1) => {
        try {
            const response = await getSharedUserWishlistService(userId, page, SHARED_WISHLIST_ITEMS_PER_PAGE);
            setWishlistItems(response.data.items);
            setFullName(`${response.data.firstName} ${response.data.lastName}`);
            setPagination(response.data.pagination);
        } catch (error) {
            toast.error('Failed to load wishlist');
        }
    };

    useEffect(() => {
        const loadWishlist = async () => {
            setLoading(true);
            await fetchWishlist(currentPage);
            setLoading(false);
            setPageChanging(false);
        };

        loadWishlist();
    }, [userId, currentPage]);

    const handlePageChange = async (event, value) => {
        setPageChanging(true);
        setCurrentPage(value);
        await fetchWishlist(value);
        setPageChanging(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBulkAddToCart = async () => {
        setBulkAddLoading(true);
        try {
            const response = await bulkAddWishlistToCartService(userId);

            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(getCartCount());
                document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { type: 'bulk_add', userId: userId } }));
            }
        } catch (error) {
            console.error('Error adding all items to cart:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add items to cart';
            toast.error(errorMessage);
        } finally {
            setBulkAddLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 mb-16 mt-32 md:mt-0 bg-gray-50">
                <Header
                    fullName={fullName}
                    loading={loading}
                    totalWishlistItems={pagination.totalItems}
                    isSharedWishlist={true}
                    onBulkAddToCart={handleBulkAddToCart}
                    bulkAddLoading={bulkAddLoading}
                />

                {loading || pageChanging ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <LoadingProductItem count={SHARED_WISHLIST_ITEMS_PER_PAGE} />
                    </div>
                ) : wishlistItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {wishlistItems.map((item) => (
                                <ProductItem
                                    key={item.product._id}
                                    product={item.product}
                                />
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="flex justify-start mt-4">
                                <CustomPagination
                                    count={pagination.totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState imageSrc={emptyWishlistImage} context="sharedWishlist" />
                )}
            </div>
            <Footer />
        </>
    );
};

export default SharedWishlist;