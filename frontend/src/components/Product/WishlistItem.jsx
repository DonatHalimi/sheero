import DeleteIcon from '@mui/icons-material/DeleteOutline';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    AddToCartButton,
    BrownShoppingCartIcon,
    DiscountPercentage,
    LoadingOverlay,
    OutOfStock,
    ProductItemSkeleton,
    WishlistButton
} from '../../assets/CustomComponents';
import NoImage from '../../assets/img/product-not-found.jpg';
import useAxios from '../../axiosInstance';
import { getImageUrl } from '../../config';
import { AuthContext } from '../../context/AuthContext';

const WishlistItem = ({ product, onRemove, loading }) => {
    const { auth } = useContext(AuthContext);
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const [isActionLoading, setIsActionLoading] = useState(false);

    const { _id, name, image, price, discount, salePrice, inventoryCount } = product || {};
    const imageUrl = getImageUrl(image);
    const discountPercentage = discount?.value || 0;
    const finalPrice = salePrice > 0 ? salePrice : price;

    const handleClick = () => { if (_id) navigate(`/product/${_id}`); };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        if (!auth.accessToken) {
            toast.error("You need to log in first.");
            navigate('/login');
            return;
        }

        setIsActionLoading(true);

        const data = {
            productId: _id,
            quantity: 1
        };

        try {
            await axiosInstance.post(`/cart/add`, data);

            toast.success('Product added to cart!', { onClick: () => navigate('/cart') });

            document.dispatchEvent(new CustomEvent('productAddedToCart', { detail: _id }));
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to add product to cart.';
            toast.error(errorMsg, { onClick: () => navigate('/cart') });
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleRemove = async (e) => {
        e.stopPropagation();
        setIsActionLoading(true);
        try {
            await onRemove(_id);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <>
            {isActionLoading && <LoadingOverlay />}
            {loading ? (
                <ProductItemSkeleton />
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col cursor-pointer" onClick={handleClick}>
                        <div className="relative mb-2">
                            <img
                                src={imageUrl}
                                alt={name}
                                className="w-full h-32 sm:h-48 object-contain rounded"
                                onError={(e) => e.target.src = NoImage}
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
                            <AddToCartButton onClick={handleAddToCart} disabled={isActionLoading || inventoryCount === 0}>
                                <BrownShoppingCartIcon />
                                <span className="hidden sm:inline ml-3">Add To Cart</span>
                            </AddToCartButton>
                            <WishlistButton onClick={handleRemove} disabled={isActionLoading}>
                                <DeleteIcon />
                            </WishlistButton>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default WishlistItem;