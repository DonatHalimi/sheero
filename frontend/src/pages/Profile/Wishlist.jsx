import React, { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { calculatePageCount, CustomDeleteModal, CustomPagination, EmptyState, getPaginatedItems, handlePageChange, Header, ProductItemSkeleton, ProfileLayout } from '../../assets/CustomComponents';
import emptyWishlistImage from '../../assets/img/empty/wishlist.png';
import useAxios from '../../axiosInstance';
import Navbar from '../../components/Navbar/Navbar';
import WishlistItem from '../../components/Product/Items/WishlistItem';
import Footer from '../../components/Utils/Footer';
import { AuthContext } from '../../context/AuthContext';

const itemsPerPage = 6;

const Wishlist = () => {
    const { auth } = useContext(AuthContext);
    const axiosInstance = useMemo(() => useAxios(), []);

    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchData = async () => {
            try {
                const userResponse = await axiosInstance.get('/auth/me');
                setUserId(userResponse.data.id);

                const wishlistResponse = await axiosInstance.get('/wishlist');
                setWishlistItems(wishlistResponse.data.items);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [auth.accessToken]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await axiosInstance.delete(`/wishlist/remove`, {
                data: { productId },
            });
            setWishlistItems((items) => items.filter(item => item.product._id !== productId));
            toast.success('Product removed from wishlist');
        } catch (error) {
            console.error('Error removing product from wishlist:', error);
            toast.error('Failed to remove product from wishlist.');
        }
    };

    const handleClearWishlist = async () => {
        try {
            await axiosInstance.delete('/wishlist/clear');
            setWishlistItems([]);
            toast.success('Wishlist cleared successfully');
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            toast.error('Failed to clear wishlist.');
        } finally {
            setIsModalOpen(false);
        }
    };

    const handleShareWishlist = () => {
        const shareUrl = `${window.location.origin}/wishlist/${userId}`;

        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                toast.success(
                    <div>Wishlist link copied to clipboard! Click here to open it!</div>,
                    {
                        onClick: () => window.open(shareUrl, '_blank'),
                        className: 'cursor-pointer'
                    }
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
                        <ProductItemSkeleton count={6} />
                    </div>
                ) : !wishlistItems.length ? (
                    <EmptyState
                        imageSrc={emptyWishlistImage}
                        message="Your wishlist is empty!"
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