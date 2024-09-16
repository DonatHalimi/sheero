import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CartWishlistButtons, ProductItemSkeleton } from '../../assets/CustomComponents';
import NoImage from '../../assets/img/product-not-found.jpg';
import { AuthContext } from '../../context/AuthContext';

const ProductItem = ({ product, loading }) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    const { _id, name, image, price, salePrice } = product || {};
    const imageUrl = `http://localhost:5000/${image}`;

    const discountPercentage = salePrice && price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;

    const finalPrice = salePrice > 0 ? salePrice : price;

    const handleClick = () => {
        if (_id) {
            navigate(`/product/${_id}`);
        } else {
            console.error("Product ID is undefined");
        }
    };

    const handleAction = (action) => async (e) => {
        e.stopPropagation();
        if (!auth.accessToken) {
            toast.error('You need to log in first.');
            navigate('/login');
            return;
        }

        if (action === 'cart') setIsCartLoading(true);
        if (action === 'wishlist') setIsWishlistLoading(true);

        try {
            const endpoint = action === 'cart' ? 'cart/add' : 'wishlist/add';
            await axios.post(`http://localhost:5000/api/${endpoint}`, {
                productId: product._id,
                ...(action === 'cart' && { quantity: 1 }),
            }, {
                headers: { Authorization: `Bearer ${auth.accessToken}` }
            });

            toast.success(`Product added to ${action === 'cart' ? 'cart' : 'wishlist'}!`, {
                onClick: () => navigate(`/${action}`),
            });

            if (action === 'cart') {
                document.dispatchEvent(new CustomEvent('productAddedToCart', { detail: product._id }));
            }

        } catch (error) {
            const errorMsg = error.response?.data?.message || `Failed to add product to ${action}.`;
            toast.info(errorMsg, { onClick: () => navigate(`/${action}`), });
        } finally {
            if (action === 'cart') setIsCartLoading(false);
            if (action === 'wishlist') setIsWishlistLoading(false);
        }
    };

    if (loading) {
        return <ProductItemSkeleton />;
    }

    return (
        <>
            {(isCartLoading || isWishlistLoading) && (
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
                    <CartWishlistButtons
                        handleAction={handleAction}
                        isCartLoading={isCartLoading}
                        isWishlistLoading={isWishlistLoading}
                    />
                </div>
            </div>
        </>
    );
};

export default ProductItem;