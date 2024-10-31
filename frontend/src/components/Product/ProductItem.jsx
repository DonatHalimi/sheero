import { CircularProgress } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CartWishlistButtons, DiscountPercentage, formatPrice, OutOfStock, ProductItemSkeleton } from '../../assets/CustomComponents';
import NoImage from '../../assets/img/errors/product-not-found.png';
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

    const formattedFinalPrice = formatPrice(finalPrice);
    const formattedPrice = formatPrice(price);

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
            <div className="bg-white rounded-md shadow-sm p-4 flex flex-col cursor-pointer transition-shadow duration-300 hover:shadow-md" onClick={handleClick}>
                <div className="relative mb-2">
                    <img
                        src={imageUrl}
                        alt={name}
                        loading="lazy"
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

                <div className="flex justify-between items-center mt-auto">
                    <CartWishlistButtons
                        handleAction={handleAction}
                        isCartLoading={isLoading.cart}
                        isWishlistLoading={isLoading.wishlist}
                        inventoryCount={product.inventoryCount}
                    />
                </div>
            </div >
        </>
    );
};

export default ProductItem;