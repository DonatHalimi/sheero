import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddToCartButton, BrownShoppingCartIcon, WishlistButton } from '../assets/CustomComponents';
import NoImage from '../assets/not-found.jpg';

const ProductItem = ({ product }) => {
    const navigate = useNavigate();
    const name = product.name || "";
    const imageUrl = `http://localhost:5000/${product.image}`;
    const originalPrice = product.price || 0;
    const discountPercentage = product.discount?.value || 0;
    const discountedPrice = product.salePrice || originalPrice;

    const handleClick = () => {
        if (product._id) {
            navigate(`/product-details/${product._id}`);
        } else {
            console.error("Product ID is undefined");
        }
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md p-4 flex flex-col cursor-pointer"
            onClick={handleClick}
        >
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
                <span className="font-bold text-lg">{discountedPrice.toFixed(2)} €</span>
                {discountPercentage > 0 && (
                    <span className="text-gray-500 line-through text-sm">{originalPrice.toFixed(2)} €</span>
                )}
            </div>
            <div className="flex justify-between items-center mt-auto">
                <AddToCartButton>
                    <BrownShoppingCartIcon /> Add To Cart
                </AddToCartButton>
                <WishlistButton>
                    <FavoriteIcon />
                </WishlistButton>
            </div>
        </div>
    );
};

export default ProductItem;
