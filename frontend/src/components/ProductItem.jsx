import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AddToCartButton, BrownShoppingCartIcon, WishlistButton, ProductItemSkeleton } from '../assets/CustomComponents';
import NoImage from '../assets/not-found.jpg';
import { AuthContext } from '../context/AuthContext';

const ProductItem = ({ product, loading }) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const { _id, name, image, price, discount, salePrice } = product || {};
    const imageUrl = `http://localhost:5000/${image}`;
    const discountPercentage = discount?.value || 0;
    const finalPrice = salePrice || price || 0;

    const handleClick = () => {
        if (_id) {
            navigate(`/product/${_id}`);
        } else {
            console.error("Product ID is undefined");
        }
    };

    const handleAction = (action) => async (e) => {
        e.stopPropagation();  // Prevent parent click event from triggering
        if (!auth.accessToken) {
            toast.error("You need to log in first.");
            navigate('/login');
            return;
        }

        setIsActionLoading(true);
        try {
            if (action === 'cart') {
                await axios.post('http://localhost:5000/api/cart/add', {
                    productId: _id,
                    quantity: 1
                }, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` }
                });

                document.dispatchEvent(new Event('productAdded'));

                toast.success('Product added to cart!', {
                    onClick: () => { navigate('/cart'); }
                });
            } else if (action === 'wishlist') {
                await axios.post('http://localhost:5000/api/wishlist/add', {
                    productId: _id
                }, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` }
                });
                toast.success('Product added to wishlist!');
            }
        } catch (error) {
            console.error(`Failed to add product to ${action}:`, error.response?.data?.message || error.message);
            toast.error(`Failed to add product to ${action}.`);
        } finally {
            setIsActionLoading(false);
        }
    };

    if (loading) {
        return <ProductItemSkeleton />;
    }

    return (
        <>
            {isActionLoading && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
                    <CircularProgress size={60} style={{ color: '#373533' }} />
                </div>
            )}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col cursor-pointer" onClick={handleClick}>
                <div className="relative mb-2">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-48 object-cover rounded"
                        onError={(e) => { e.target.onerror = null; e.target.src = NoImage; }}
                    />
                    {discountPercentage > 0 && (
                        <span className="absolute top-2 right-2 bg-red-400 text-white px-2 py-1 rounded text-xs">
                            -{discountPercentage}%
                        </span>
                    )}
                </div>
                <h2 className="font-semibold mt-2 h-10 overflow-hidden">{name}</h2>
                <div className="flex flex-col mb-2">
                    <span className="font-bold text-lg">{finalPrice.toFixed(2)} €</span>
                    {discountPercentage > 0 && (
                        <span className="text-gray-500 line-through text-sm">
                            {price.toFixed(2)} €
                        </span>
                    )}
                </div>
                <div className="flex justify-between items-center mt-auto">
                    <AddToCartButton onClick={handleAction('cart')} disabled={isActionLoading}>
                        <BrownShoppingCartIcon /> Add To Cart
                    </AddToCartButton>
                    <WishlistButton onClick={handleAction('wishlist')} disabled={isActionLoading}>
                        <FavoriteIcon />
                    </WishlistButton>
                </div>
            </div>
        </>
    );
};

export default ProductItem;