import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { calculatePageCount, CustomDeleteModal, CustomPagination, EmptyState, getPaginatedItems, handlePageChange, Header, LoadingProductItem, ProfileLayout } from '../../assets/CustomComponents';
import emptyWishlistImage from '../../assets/img/empty/wishlist.png';
import Navbar from '../../components/Navbar/Navbar';
import WishlistItem from '../../components/Product/Items/WishlistItem';
import Footer from '../../components/Utils/Footer';
import { clearWishlist, getWishlistItems, removeFromWishlist } from '../../store/actions/wishlistActions';

const itemsPerPage = 6;

const Wishlist = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { wishlistItems, loading } = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getWishlistItems());
        }
    }, [isAuthenticated, dispatch]);

    const handleRemoveFromWishlist = (productId) => {
        dispatch(removeFromWishlist(productId));
        toast.success('Product removed from wishlist');
    };

    const handleClearWishlist = () => {
        dispatch(clearWishlist(() => setIsModalOpen(false)));
        toast.success('Wishlist cleared successfully');
    };

    const handleShareWishlist = () => {
        const shareUrl = `${window.location.origin}/wishlist/${user.id}`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                toast.success(
                    <div>Wishlist link copied to clipboard! Click here to open it!</div>,
                    { onClick: () => window.open(shareUrl, '_blank'), className: 'cursor-pointer' }
                );
            })
            .catch(() => {
                toast.error('Failed to copy wishlist link.');
            });
    };

    const pageCount = calculatePageCount(wishlistItems, itemsPerPage);
    const currentPageItems = getPaginatedItems(wishlistItems, currentPage, itemsPerPage);

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header
                    title="Wishlist"
                    wishlistItems={wishlistItems}
                    setIsModalOpen={setIsModalOpen}
                    handleShareWishlist={handleShareWishlist}
                />

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <LoadingProductItem count={6} />
                    </div>
                ) : !wishlistItems.length ? (
                    <EmptyState
                        imageSrc={emptyWishlistImage}
                        context="wishlist"
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                            {currentPageItems.map(({ product }) => (
                                <WishlistItem
                                    key={product._id}
                                    product={product}
                                    onRemove={() => handleRemoveFromWishlist(product._id)}
                                />
                            ))}
                        </div>

                        <div className="flex justify-start">
                            {!loading && wishlistItems.length > 0 && (
                                <CustomPagination
                                    count={pageCount}
                                    page={currentPage}
                                    onChange={handlePageChange(setCurrentPage)}
                                    size="medium"
                                    sx={{
                                        position: 'relative',
                                        bottom: '-2px',
                                        '& .MuiPagination-ul': {
                                            justifyContent: 'flex-start',
                                        },
                                    }}
                                />
                            )}
                        </div>
                    </>
                )}
            </ProfileLayout>
            <Footer />

            <CustomDeleteModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDelete={handleClearWishlist}
                title="Clear Wishlist"
                message="Are you sure you want to clear the wishlist?"
            />
        </>
    );
};

export default Wishlist;