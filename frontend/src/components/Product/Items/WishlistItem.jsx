import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CartDeleteButtons, DiscountPercentage, formatPrice, LoadingOverlay, OutOfStock } from '../../../assets/CustomComponents';
import NoImage from '../../../assets/img/errors/product-not-found.png';
import { addToCartService } from '../../../services/cartService';
import { getImageUrl } from '../../../utils/config';

const WishlistItem = ({ product, onRemove }) => {
    const { isAuthenticated } = useSelector(state => state.auth);

    const { _id, name, image, price, discount, salePrice, inventoryCount } = product || {};
    const imageUrl = getImageUrl(image);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const discountPercentage = discount?.value || 0;
    const finalPrice = salePrice > 0 ? salePrice : price;

    const formattedFinalPrice = formatPrice(finalPrice);
    const formattedPrice = formatPrice(price);

    const navigate = useNavigate();
    const handleClick = () => { if (_id) navigate(`/product/${_id}`); };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error("You need to log in first");
            navigate('/login');
            return;
        }

        setIsActionLoading(true);

        const data = {
            productId: _id,
            quantity: 1
        };

        try {
            await addToCartService(data);
            toast.success('Product added to cart', { onClick: () => navigate('/cart') });

            document.dispatchEvent(new CustomEvent('cartUpdated', { detail: _id }));
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to add product to cart.';
            toast.error(errorMsg, { onClick: () => navigate('/cart') });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleRemove = async (e) => {
        e.stopPropagation();
        await onRemove(_id);
    };

    return (
        <>
            {isActionLoading && <LoadingOverlay />}
            <div className="bg-white rounded-md shadow-sm p-4 flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-md" onClick={handleClick}>
                <div className="relative mb-2">
                    <img
                        src={imageUrl}
                        alt={name}
                        onError={(e) => { e.target.onerror = null; e.target.src = NoImage; }}
                        className="w-full h-32 sm:h-48 object-contain rounded"
                    />
                    <div className="absolute inset-0 rounded transition-opacity duration-300 hover:opacity-20 opacity-0 bg-white" />

                    <OutOfStock inventoryCount={inventoryCount} />

                    <DiscountPercentage discountPercentage={discountPercentage} />
                </div>

                <h2 className="font-semibold text-sm sm:text-base h-6 sm:h-8 overflow-hidden whitespace-nowrap text-ellipsis w-full hover:underline">
                    {name}
                </h2>

                <div className="flex flex-col mb-2">
                    <span className="font-bold text-base sm:text-lg">{formattedFinalPrice} €</span>
                    {discountPercentage > 0 && (
                        <span className="text-gray-500 line-through text-xs sm:text-sm">{formattedPrice} €</span>
                    )}
                </div>

                <div onClick={(e) => e.stopPropagation()} className="flex justify-between items-center mt-auto">
                    <CartDeleteButtons
                        handleAddToCart={handleAddToCart}
                        handleRemove={handleRemove}
                        isActionLoading={isActionLoading}
                        inventoryCount={inventoryCount}
                    />
                </div>
            </div>
        </>
    );
};

export default WishlistItem;