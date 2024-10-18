import { CircularProgress } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CartWishlistButtons, DiscountPercentage, OutOfStock, ProductItemSkeleton } from '../../assets/CustomComponents';
import NoImage from '../../assets/img/product-not-found.jpg';
import useAxios from '../../axiosInstance';
import { getApiUrl, getImageUrl } from '../../config';
import { AuthContext } from '../../context/AuthContext';

const ProductItem = ({ product, loading }) => {
    const { auth } = useContext(AuthContext);
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState({ cart: false, wishlist: false });

    const { _id, name, image, price, salePrice, inventoryCount } = product || {};
    const imageUrl = getImageUrl(image);
    const discountPercentage = salePrice && price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;
    const finalPrice = salePrice > 0 ? salePrice : price;

    const handleClick = () => { if (_id) navigate(`/product/${_id}`); };

    if (loading) {
        return <ProductItemSkeleton />;
    }

    const handleAction = (action) => async (e) => {
        e.stopPropagation();
        if (!auth.accessToken) {
            toast.error('You need to log in first.');
            navigate('/login');
            return;
        }

        setIsLoading((prev) => ({ ...prev, [action]: true }));

        try {
            const endpoint = action === 'cart' ? 'cart/add' : 'wishlist/add';
            await axiosInstance.post(getApiUrl(`/${endpoint}`), {
                productId: _id,
                ...(action === 'cart' && { quantity: 1 }),
            });

            toast.success(`Product added to ${action === 'cart' ? 'cart' : 'wishlist'}!`, {
                onClick: () => navigate(`/${action === 'wishlist' ? 'profile/wishlist' : 'cart'}`),
            });

            if (action === 'cart') {
                document.dispatchEvent(new CustomEvent('productAddedToCart', { detail: _id }));
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || `Failed to add product to ${action}.`;
            toast.info(errorMsg, { onClick: () => navigate(`/${action === 'wishlist' ? 'profile/wishlist' : 'cart'}`) });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {Object.values(isLoading).some(Boolean) && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
                    <CircularProgress size={60} style={{ color: '#373533' }} />
                </div>
            )}
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col cursor-pointer" onClick={handleClick}>
                <div className="relative mb-2">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-32 sm:h-48 object-contain rounded"
                        onError={(e) => { e.target.onerror = null; e.target.src = NoImage; }}
                    />

                    <OutOfStock inventoryCount={inventoryCount} />

                    <DiscountPercentage discountPercentage={discountPercentage} />

                </div>

                <h2 className="font-semibold text-sm sm:text-base h-6 sm:h-8 overflow-hidden whitespace-nowrap text-ellipsis w-full">
                    {name}
                </h2>

                <div className="flex flex-col mb-2">
                    <span className="font-bold text-base sm:text-lg">{finalPrice.toFixed(2)} €</span>
                    {discountPercentage > 0 && (
                        <span className="text-gray-500 line-through text-xs sm:text-sm">{price.toFixed(2)} €</span>
                    )}
                </div>

                <div className="flex justify-between items-center mt-auto">
                    <CartWishlistButtons
                        handleAction={handleAction}
                        isCartLoading={isLoading.cart}
                        isWishlistLoading={isLoading.wishlist}
                        inventoryCount={product.inventoryCount}
                    />
                </div>
            </div>
        </>
    );
};

export default ProductItem;