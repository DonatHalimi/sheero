import { DeleteOutline, Share } from '@mui/icons-material';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    CustomDeleteModal,
    CustomPagination,
    EmptyState,
    ProductItemSkeleton,
    RoundIconButton
} from '../../assets/CustomComponents';
import emptyWishlistImage from '../../assets/img/empty-wishlist.png';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import WishlistItem from '../../components/Product/WishlistItem';
import { AuthContext } from '../../context/AuthContext';
import ProfileSidebar from './ProfileSidebar';

const apiUrl = 'http://localhost:5000/api/wishlist';
const itemsPerPage = 10;

const Wishlist = () => {
    const { auth } = useContext(AuthContext);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        if (auth.accessToken) {
            const fetchWishlist = async () => {
                try {
                    const { data } = await axios.get(apiUrl, {
                        headers: { Authorization: `Bearer ${auth.accessToken}` },
                    });
                    setWishlistItems(data.items);
                    setTotalItems(data.items.length);
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                    toast.error('Failed to load wishlist.');
                } finally {
                    setLoading(false);
                }
            };
            fetchWishlist();
        }
    }, [auth.accessToken]);

    useEffect(() => window.scrollTo(0, 0), []);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await axios.delete(`${apiUrl}/remove`, {
                headers: { Authorization: `Bearer ${auth.accessToken}` },
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
            await axios.delete(`${apiUrl}/clear`, {
                headers: { Authorization: `Bearer ${auth.accessToken}` },
            });
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
        const userId = auth.userId;
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
            <Box className="container mx-auto max-w-4xl flex">
                <ProfileSidebar />
                <main className="flex-grow p-4 relative left-32">
                    <div className="container max-w-5xl mx-auto mt-20 mb-20">
                        <div className="bg-white px-4 py-4 rounded-sm shadow-sm mb-3 flex justify-between items-center">
                            <Typography variant="h5" className="text-gray-800 font-semilight">Wishlist</Typography>
                            <div className="flex space-x-2">
                                {wishlistItems.length > 0 && (
                                    <>
                                        <Button
                                            startIcon={<Share />}
                                            onClick={handleShareWishlist}
                                            disabled={loading}
                                        >
                                            Share Wishlist
                                        </Button>

                                        <Tooltip title="Clear wishlist" arrow placement="top">
                                            <RoundIconButton
                                                onClick={() => setIsModalOpen(true)}
                                                disabled={loading}
                                                className="cursor-pointer"
                                            >
                                                <DeleteOutline color="primary" />
                                            </RoundIconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </div>
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {Array.from({ length: itemsPerPage }).map((_, index) => (
                                    <ProductItemSkeleton key={index} />
                                ))}
                            </div>
                        ) : !wishlistItems.length ? (
                            <EmptyState
                                imageSrc={emptyWishlistImage}
                                message="Your wishlist is empty!"
                            />
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                                    {getCurrentPageItems().map(({ product }) => (
                                        <WishlistItem
                                            key={product._id}
                                            product={product}
                                            onRemove={() => handleRemoveFromWishlist(product._id)}
                                        />
                                    ))}
                                </div>
                                <CustomPagination
                                    count={pageCount}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                />
                            </>
                        )}
                    </div>
                </main>
            </Box>
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
