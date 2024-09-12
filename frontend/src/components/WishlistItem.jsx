import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AddToCartButton, BrownShoppingCartIcon, ProductItemSkeleton, WishlistButton } from '../assets/CustomComponents';
import NoImage from '../assets/img/product-not-found.jpg';
import { AuthContext } from '../context/AuthContext';

const apiUrl = 'http://localhost:5000';

const WishlistItem = ({ product, onRemove, loading }) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const { _id, name, image, price, discount, salePrice } = product || {};
    const imageUrl = `${apiUrl}/${image}`;
    const discountPercentage = discount?.value || 0;
    const finalPrice = salePrice > 0 ? salePrice : price;

    const handleClick = () => _id && navigate(`/product/${_id}`);

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!auth.accessToken) {
            toast.error("You need to log in first.");
            navigate('/login');
            return;
        }

        setIsActionLoading(true);
        try {
            await axios.post(`${apiUrl}/api/cart/add`, { productId: _id, quantity: 1 }, {
                headers: { Authorization: `Bearer ${auth.accessToken}` }
            });

            document.dispatchEvent(new Event('productAdded'));
            toast.success('Product added to cart!', { onClick: () => navigate('/cart') });
        } catch (error) {
            console.error('Failed to add product to cart:', error.response?.data?.message || error.message);
            toast.error('Failed to add product to cart.');
        } finally {
            setIsActionLoading(false);
        }
    };

    if (loading) return <ProductItemSkeleton />;

    return (
        <>
            {isActionLoading && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
                    <CircularProgress size={60} style={{ color: '#373533' }} />
                </div>
            )}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col cursor-pointer" onClick={handleClick}>
                <div className="relative mb-2 max-w-4xl">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-48 object-cover rounded"
                        onError={(e) => e.target.src = NoImage}
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
                    <AddToCartButton onClick={handleAddToCart} disabled={isActionLoading}>
                        <BrownShoppingCartIcon /> Add To Cart
                    </AddToCartButton>
                    <WishlistButton onClick={(e) => { e.stopPropagation(); onRemove(_id); }} disabled={isActionLoading}>
                        <DeleteIcon />
                    </WishlistButton>
                </div>
            </div>
        </>
    );
};

export default WishlistItem;