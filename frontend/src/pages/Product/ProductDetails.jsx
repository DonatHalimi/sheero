import { CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    BreadcrumbsComponent,
    DetailsCartWishlistButtons,
    ProductDetailsSkeleton
} from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import Navbar from '../../components/Navbar/Navbar';
import AddReviewModal from '../../components/Product/AddReviewModal';
import ProductDetailsTabs from '../../components/Product/ProductDetailsTabs';
import { AuthContext } from '../../context/AuthContext';

const apiUrl = 'http://localhost:5000/api';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${apiUrl}/products/get/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const openReviewModal = () => {
        if (!auth.accessToken) {
            toast.error('You need to log in first.');
            navigate('/login');
            return;
        }
        setIsReviewModalOpen(true);
    };

    const handleReviewSuccess = () => {
        setIsReviewModalOpen(false);
    };

    const handleQuantityChange = (change) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + change;
            if (newQuantity < 1) {
                return 1;
            }
            if (newQuantity > product.inventoryCount) {
                toast.warning(`Only ${product.inventoryCount} items available in stock.`);
                return product.inventoryCount;
            }
            return newQuantity;
        });
    };

    const handleAction = (action) => async (e) => {
        e.stopPropagation();
        if (!auth.accessToken) {
            toast.error('You need to log in first.');
            navigate('/login');
            return;
        }

        const endpoint = action === 'cart' ? 'cart/add' : 'wishlist/add';
        const payload = { productId: product._id, ...(action === 'cart' && { quantity }) };
        const setLoadingState = action === 'cart' ? setIsCartLoading : setIsWishlistLoading;

        setLoadingState(true);
        try {
            await axios.post(`${apiUrl}/${endpoint}`, payload, {
                headers: { Authorization: `Bearer ${auth.accessToken}` }
            });
            toast.success(`Product added to ${action === 'cart' ? 'cart' : 'wishlist'}!`, {
                onClick: () => navigate(`/${action}`),
            });

            if (action === 'cart') {
                document.dispatchEvent(new CustomEvent('productAddedToCart', { detail: product._id }));
            }

            if (action === 'cart' && quantity > product.inventoryCount) {
                toast.error(`Cannot add more than ${product.inventoryCount} items to cart.`);
                return;
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || `Failed to add product to ${action}.`;
            toast.info(errorMsg, { onClick: () => navigate(`/${action}`) });
        } finally {
            setLoadingState(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <ProductDetailsSkeleton />
                <Footer />
            </>
        );
    }

    const { name, image, price, salePrice, discount, inventoryCount } = product;
    const imageUrl = `http://localhost:5000/${image}`;
    const originalPrice = price || 0;
    const discountPercentage = discount?.value || 0;
    const discountedPrice = salePrice || originalPrice;

    const inventoryText = inventoryCount > 10
        ? "More than 10 articles"
        : `${inventoryCount} article${inventoryCount !== 1 ? 's' : ''} left`;

    return (
        <>
            {(isCartLoading || isWishlistLoading) && (
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
                            className="w-full h-80 object-contain rounded cursor-pointer"
                            onClick={() => setImagePreviewOpen(true)}
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h1 className="text-2xl break-words">{name}</h1>

                        <p
                            onClick={openReviewModal}
                            className="mb-1 underline cursor-pointer text-sm w-9 font-sm"
                        >
                            Review
                        </p>

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
                                            You save {(originalPrice - discountedPrice).toFixed(2)} €
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

                        <div className="mt-4 flex items-center">
                            <div className="flex items-center mr-4">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    className="px-3 py-1 border rounded-l"
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 border-t border-b">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= product.inventoryCount}
                                    className={`px-3 py-1 border rounded-r ${quantity >= product.inventoryCount ? 'opacity-50' : ''}`}
                                >
                                    +
                                </button>
                            </div>
                            <span className="text-sm font-semibold text-stone-600 bg-stone-100 rounded-md px-2">{inventoryText}</span>
                        </div>
                        <div className="mt-4 flex items-center">
                            <DetailsCartWishlistButtons
                                handleAction={handleAction}
                                isCartLoading={isCartLoading}
                                isWishlistLoading={isWishlistLoading}
                            />
                        </div>
                    </div>
                </div>

            </div>

            <div className="container mx-auto px-4 bg-white mt-8 mb-8 rounded-md max-w-5xl">
                <ProductDetailsTabs product={product} />
            </div>

            <ImagePreviewModal
                open={imagePreviewOpen}
                onClose={() => setImagePreviewOpen(false)}
                imageUrl={imageUrl}
            />

            {/* AddReviewModal */}
            <AddReviewModal
                open={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                product={product}
                onReviewSuccess={handleReviewSuccess}
            />

            <Footer />
        </>
    );
};

export default ProductDetails;