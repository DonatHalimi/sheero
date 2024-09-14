import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CustomPagination, EmptySharedWishlist, ProductItemSkeleton } from '../../assets/CustomComponents';
import Navbar from '../Navbar';
import { Typography } from '@mui/material';
import Footer from '../Footer';
import ProductItem from './ProductItem';

const apiUrl = 'http://localhost:5000/api/wishlist';
const itemsPerPage = 10;

const SharedWishlist = () => {
    const { userId } = useParams();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const { data } = await axios.get(`${apiUrl}/${userId}`);
                setWishlistItems(data.items);
                setUsername(data.username);
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
            <div className="container mx-auto px-4 py-8 mb-16 bg-gray-50">
                <div className="bg-white px-4 py-4 rounded-sm shadow-sm mb-3">
                    <Typography variant="h5" className="!text-gray-800 !font-semilight">
                        {username}'s Wishlist
                    </Typography>
                </div>
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, index) => (
                            <ProductItemSkeleton key={index} />
                        ))}
                    </div>
                ) : wishlistItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {getCurrentPageItems().map((item) => (
                                <ProductItem key={item.product._id} product={item.product} />
                            ))}
                        </div>
                        <CustomPagination
                            count={pageCount}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptySharedWishlist username={username} />
                )}
            </div>
            <Footer />
        </>
    );
};

export default SharedWishlist;