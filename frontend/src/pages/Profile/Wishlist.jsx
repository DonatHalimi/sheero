import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import emptyWishlistImage from '../../assets/img/empty/wishlist.png';
import { LoadingProductItem } from '../../components/custom/LoadingSkeletons';
import { CustomDeleteModal, CustomPagination, EmptyState } from '../../components/custom/MUI';
import { Header, ProfileLayout } from '../../components/custom/Profile';
import Navbar from '../../components/Navbar/Navbar';
import WishlistItem from '../../components/Product/Items/WishlistItem';
import Footer from '../../components/Utils/Footer';
import { ITEMS_PER_PAGE } from '../../services/wishlistService';
import { clearWishlist, getWishlistCount, getWishlistItems, removeFromWishlist } from '../../store/actions/wishlistActions';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { wishlistItems, loading, pagination } = useSelector((state) => state.wishlist);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageChanging, setPageChanging] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        dispatch(getWishlistItems(currentPage, ITEMS_PER_PAGE))
            .finally(() => setPageChanging(false));
    }, [isAuthenticated, dispatch, currentPage]);

    const refetchWishlist = async () => {
        try {
            const result = await dispatch(getWishlistItems(currentPage, ITEMS_PER_PAGE));

            if (result.items.length === 0 && currentPage > 1) {
                const newPage = Math.max(1, Math.ceil((result.totalCount || 0) / ITEMS_PER_PAGE));
                setCurrentPage(newPage);
                await dispatch(getWishlistItems(newPage, ITEMS_PER_PAGE));
            }

            dispatch(getWishlistCount());
            document.dispatchEvent(new Event('wishlistUpdated'));
        } catch (error) {
            console.error('Error refetching wishlist:', error);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await dispatch(removeFromWishlist(productId));
            toast.success('Product removed from wishlist');

            await refetchWishlist();
        } catch {
            toast.error('Failed to remove from wishlist');
        }
    };

    const handleClear = async () => {
        setIsClearing(true);

        try {
            await dispatch(clearWishlist(() => setIsModalOpen(false)));
            toast.success('Wishlist cleared successfully');

            setCurrentPage(1);

            dispatch(getWishlistCount());
            document.dispatchEvent(new Event('wishlistUpdated'));

            await refetchWishlist();
        } catch (error) {
            toast.error('Failed to clear wishlist');
            console.error('Error clearing wishlist:', error);
        } finally {
            setIsClearing(false);
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/wishlist/${user.id}`;
        navigator.clipboard.writeText(url)
            .then(() => toast.success('Wishlist link copied! Click to open', {
                onClick: () => window.open(url, '_blank'),
                className: 'cursor-pointer'
            }))
            .catch(() => toast.error('Failed to copy wishlist link'));
    };

    const handlePageChangeLocal = (e, page) => {
        setPageChanging(true);
        setCurrentPage(page);
        dispatch(getWishlistItems(page, ITEMS_PER_PAGE))
            .finally(() => setPageChanging(false));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const shouldShowPagination = pagination && pagination.totalPages > 1 && wishlistItems.length > 0;

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title="Wishlist"
                    wishlistItems={wishlistItems}
                    setIsModalOpen={setIsModalOpen}
                    handleShareWishlist={handleShare}
                />

                {loading || pageChanging ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <LoadingProductItem count={6} />
                    </div>
                ) : !wishlistItems.length ? (
                    <EmptyState imageSrc={emptyWishlistImage} context="wishlist" />
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                            {wishlistItems.map(({ product }) => (
                                <WishlistItem
                                    key={product._id}
                                    product={product}
                                    onRemove={() => handleRemove(product._id)}
                                />
                            ))}
                        </div>

                        {shouldShowPagination && (
                            <div className="flex justify-start">
                                <CustomPagination
                                    count={pagination.totalPages}
                                    page={currentPage}
                                    onChange={handlePageChangeLocal}
                                    size="medium"
                                    sx={{
                                        position: 'relative',
                                        bottom: '-2px',
                                        '& .MuiPagination-ul': { justifyContent: 'flex-start' },
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}
            </ProfileLayout>

            <Footer />

            <CustomDeleteModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Clear Wishlist"
                message="Are you sure you want to clear your wishlist?"
                onDelete={handleClear}
                loading={isClearing}
            />
        </>
    );
};

export default Wishlist;