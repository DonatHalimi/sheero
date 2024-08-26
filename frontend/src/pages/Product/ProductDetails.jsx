import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AddToCartButton, BreadcrumbsComponent, BrownShoppingCartIcon, ProductSkeleton, WishlistButton } from '../../assets/CustomComponents';
import NoImage from '../../assets/not-found.jpg';
import Footer from '../../components/Footer';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import Navbar from '../../components/Navbar';
import ProductDetailsTabs from '../../components/ProductDetailsTabs';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/get/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <ProductSkeleton />
                <Footer />
            </>
        );
    }

    const handleImageClick = () => {
        setImagePreviewOpen(true);
    };

    const { name, image, price, salePrice, discount } = product;

    const imageUrl = `http://localhost:5000/${image}`;
    const originalPrice = price || 0;
    const discountPercentage = discount?.value || 0;
    const discountedPrice = salePrice || originalPrice;

    return (
        <>
            <Navbar />
            <BreadcrumbsComponent product={product} />
            <div className="container mx-auto px-4 py-4 mb-8 bg-white mt-8 rounded-md max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center md:w-1/2">
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-80 object-cover rounded"
                            onError={(e) => { e.target.onerror = null; e.target.src = NoImage; }}
                            onClick={handleImageClick}
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h1 className="text-2xl">{name}</h1>
                        <div className="mt-4 flex flex-col">
                            {discountPercentage > 0 ? (
                                <>
                                    <span className="text-gray-500 line-through text-sm">
                                        {originalPrice.toFixed(2)} €
                                    </span>
                                    <span className="text-2xl font-bold text-stone-600">
                                        {discountedPrice.toFixed(2)} €
                                    </span>
                                    <div className="flex items-center mt-1">
                                        <span className="text-sm font-semibold text-stone-600">
                                            You save {(originalPrice - discountedPrice).toFixed(2)}€
                                        </span>
                                        <span className="ml-2 text-sm font-semibold text-stone-600 bg-stone-100 rounded-md px-1">
                                            -{discountPercentage}%
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-2xl font-bold">
                                    {originalPrice.toFixed(2)} €
                                </span>
                            )}
                        </div>
                        <div className="mt-4 flex items-center space-x-4">
                            <AddToCartButton>
                                <BrownShoppingCartIcon /> Add To Cart
                            </AddToCartButton>
                            <WishlistButton>
                                <FavoriteIcon />
                            </WishlistButton>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 bg-white mt-8 mb-8 rounded-md max-w-5xl">
                <div className="mt-4">
                    <ProductDetailsTabs product={product} />
                </div>
            </div>

            <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={imageUrl} />
            <Footer />
        </>
    );
};

export default ProductDetails;