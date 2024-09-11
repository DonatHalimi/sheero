import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    AddToCartButton,
    BreadcrumbsComponent,
    BrownShoppingCartIcon,
    ProductSkeleton,
    StyledFavoriteIcon,
    WishlistButton,
} from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import Navbar from '../../components/Navbar';
import ProductDetailsTabs from '../../components/ProductDetailsTabs';
import { AuthContext } from '../../context/AuthContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/get/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAction = (action) => async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        try {
            if (action === 'cart') {
                await axios.post('http://localhost:5000/api/cart/add', {
                    productId: product._id,
                    quantity: 1
                }, {
                    headers: { Authorization: `Bearer ${auth.accessToken}` }
                });
                toast.success('Product added to cart!', {
                    onClick: () => { navigate('/cart'); }
                });
            } else if (action === 'wishlist') {
                // TODO: Logic for adding to wishlist
                toast.success('Product added to wishlist!');
            }
        } catch (error) {
            console.error(`Failed to add product to ${action}:`, error.response?.data?.message || error.message);
            toast.error(`Failed to add product to ${action}.`);
        } finally {
            setIsLoading(false);
        }
    };

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
            {isLoading && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
                    <CircularProgress size={60} style={{ color: '#373533' }} />
                </div>
            )}

            <Navbar />
            <BreadcrumbsComponent product={product} />

            <div className="container mx-auto px-4 py-4 mb-8 bg-white mt-8 rounded-md max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center md:w-1/2">
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-80 object-cover rounded hover:cursor-pointer"
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
                            <AddToCartButton onClick={handleAction('cart')} disabled={isLoading}>
                                <BrownShoppingCartIcon /> Add To Cart
                            </AddToCartButton>
                            <WishlistButton onClick={handleAction('wishlist')} disabled={isLoading}>
                                <StyledFavoriteIcon />
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

            <ImagePreviewModal
                open={imagePreviewOpen}
                onClose={() => setImagePreviewOpen(false)}
                imageUrl={imageUrl}
            />

            <Footer />
        </>
    );
};

export default ProductDetails;
