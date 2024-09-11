import { Box, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { EmptyWishlist, ProductItemSkeleton } from '../../assets/CustomComponents';
import { AuthContext } from '../../context/AuthContext';
import Footer from '../Footer';
import Navbar from '../Navbar';
import WishlistItem from '../WishlistItem';
import ProfileSidebar from './ProfileSidebar';

const Wishlist = () => {
    const { auth } = useContext(AuthContext);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/wishlist', {
                    headers: { Authorization: `Bearer ${auth.accessToken}` }
                });
                setWishlistItems(response.data.items);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };

        if (auth.accessToken) {
            fetchWishlist();
        }
    }, [auth.accessToken]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await axios.delete('http://localhost:5000/api/wishlist/remove', {
                headers: { Authorization: `Bearer ${auth.accessToken}` },
                data: { productId }
            });
            setWishlistItems(wishlistItems.filter(item => item.product._id !== productId));
            toast.success('Product removed from wishlist');
        } catch (error) {
            console.error('Error removing product from wishlist:', error);
            toast.error('Failed to remove product from wishlist.');
        }
    };

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex">
                <ProfileSidebar />
                <main className="flex-grow p-4 relative left-24">
                    <div className="container max-w-5xl mx-auto mt-20 mb-20">
                        <div className="bg-white px-4 py-4 rounded-sm shadow-sm mb-3">
                            <Typography variant="h5" className="!text-gray-800 !font-semilight">
                                Wishlist
                            </Typography>
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <ProductItemSkeleton key={index} />
                                ))}
                            </div>
                        ) : wishlistItems.length === 0 ? (
                            <EmptyWishlist />
                        ) : (
                            <div className="grid grid-cols-3 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                                {wishlistItems.map(({ product }) => (
                                    <WishlistItem
                                        key={product._id}
                                        product={product}
                                        loading={false}
                                        onRemove={() => handleRemoveFromWishlist(product._id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </Box>
            <Footer />
        </>
    );
};

export default Wishlist;