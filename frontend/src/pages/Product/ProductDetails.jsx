import { Add, LocalAtm, Payment, Remove } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DetailsBreadcrumbs, DetailsCartWishlistButtons, formatPrice, LoadingOverlay, LoadingProductDetails, OutOfStock } from '../../assets/CustomComponents';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import Navbar from '../../components/Navbar/Navbar';
import AddReviewModal from '../../components/Product/Modals/AddReviewModal';
import ProductDetailsTabs from '../../components/Product/Utils/ProductDetailsTabs';
import Footer from '../../components/Utils/Footer';
import { addToCartService } from '../../services/cartService';
import { getProductDetails } from '../../services/productService';
import { addToWishlistService } from '../../services/wishlistService';
import { getImageUrl } from '../../utils/config';

const ProductDetails = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const { name, image, price, salePrice, discount, inventoryCount } = product || {};
    const imageUrl = getImageUrl(image);
    const originalPrice = price || 0;
    const discountPercentage = discount?.value || 0;
    const discountedPrice = salePrice || originalPrice;
    const finalPrice = salePrice > 0 ? salePrice : price;
    const inventoryText = inventoryCount > 10 ? "More than 10 articles" : `${inventoryCount} article${inventoryCount !== 1 ? 's' : ''} left`;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductDetails(id);
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

    const openReviewModal = () => {
        if (!isAuthenticated) {
            toast.error('You need to log in first');
            navigate('/login');
            return;
        }
        setIsReviewModalOpen(true);
    };

    const handleReviewSuccess = () => {
        setIsReviewModalOpen(false);
    };

    const handleQuantityChange = (change) => {
        setQuantity((prevQuantity) => {
            const newQuantity = prevQuantity + change;
            if (newQuantity < 1) return 1;
            if (newQuantity > product.inventoryCount) {
                toast.warning(`Only ${product.inventoryCount} items available in stock.`);
                return product.inventoryCount;
            }
            return newQuantity;
        });
    };

    const handleAction = (action) => async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('You need to log in first');
            navigate('/login');
            return;
        }

        const payload = { productId: product._id, ...(action === 'cart' && { quantity }) };
        const setLoadingState = action === 'cart' ? setIsCartLoading : setIsWishlistLoading;
        const service = action === 'cart' ? addToCartService : addToWishlistService;

        setLoadingState(true);
        try {
            await service(payload);

            toast.success(`Product added to ${action === 'cart' ? 'cart' : 'wishlist'}!`, {
                onClick: () => navigate(`/${action === 'wishlist' ? 'profile/wishlist' : 'cart'}`),
            });

            if (action === 'cart') {
                document.dispatchEvent(new CustomEvent('cartUpdated', { detail: product._id }));

                if (quantity > product.inventoryCount) {
                    toast.error(`Cannot add more than ${product.inventoryCount} items to cart.`);
                    return;
                }
            }
        } catch (error) {
            if (error.response && error.response.data.errors) {
                error.response.data.errors.forEach((err) => {
                    toast.info(err.message || `Error: ${err}`, {
                        onClick: () => navigate(`/${action === 'wishlist' ? 'profile/wishlist' : 'cart'}`),
                    });
                });
            } else {
                const errorMsg = error.response?.data?.message || `Failed to add product to ${action}.`;
                toast.info(errorMsg, { onClick: () => navigate(`/${action === 'wishlist' ? 'profile/wishlist' : 'cart'}`) });
            }
        } finally {
            setLoadingState(false);
        }
    };

    return (
        <>
            {(isCartLoading || isWishlistLoading) && (<LoadingOverlay />)}

            <Navbar />
            {loading ? (
                <LoadingProductDetails />
            ) : (
                <>
                    <DetailsBreadcrumbs product={product} />
                    <div className="container mx-auto px-4 py-4 mb-8 bg-white mt-28 md:mt-8 rounded-md max-w-5xl">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col items-center md:w-1/2 relative">
                                <img
                                    src={imageUrl}
                                    alt={name}
                                    onClick={() => setImagePreviewOpen(true)}
                                    className="w-full h-80 object-contain rounded cursor-pointer"
                                />
                                <OutOfStock inventoryCount={inventoryCount} />
                            </div>
                            <div className="md:w-1/2">
                                <h1 className="text-2xl break-words">{name}</h1>

                                <p
                                    onClick={openReviewModal}
                                    className="underline cursor-pointer text-sm w-9 font-sm"
                                >
                                    Review
                                </p>

                                <div className="mt-2 flex flex-col">
                                    {discountPercentage > 0 ? (
                                        <>
                                            <span className="text-gray-500 line-through text-sm">
                                                {formatPrice(originalPrice)} €
                                            </span>
                                            <span className="text-2xl font-bold text-stone-600">
                                                {formatPrice(finalPrice)} €
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
                                            {formatPrice(originalPrice)} €
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center mt-2">
                                    <p className="text-xs mr-2">Quantity</p>
                                    <div className="flex-1 border-t bg-gray-100 mt-1"></div>
                                </div>

                                <div className="mt-2 flex items-center">
                                    <div className="flex items-center mr-4">
                                        <IconButton
                                            onClick={() => handleQuantityChange(-1)}
                                            disabled={quantity <= 1}
                                            size="small"
                                            centerRipple={false}
                                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600"
                                        >
                                            <Remove fontSize="small" />
                                        </IconButton>
                                        <span className="px-3 py-1">{quantity}</span>
                                        <IconButton
                                            onClick={() => handleQuantityChange(1)}
                                            disabled={quantity >= product.inventoryCount}
                                            size="small"
                                            centerRipple={false}
                                            className={`px-3 py-1 border rounded-r ${quantity >= product.inventoryCount ? 'opacity-50' : ''}`}
                                        >
                                            <Add fontSize="small" />
                                        </IconButton>
                                    </div>
                                    <span className="text-sm font-semibold text-stone-600 bg-stone-100 rounded-md px-2">
                                        {inventoryText}
                                    </span>
                                </div>

                                <div className="flex items-center mt-2">
                                    <p className="text-xs mr-2">Payment Methods</p>
                                    <div className="flex-1 border-t bg-gray-100 mt-1"></div>
                                </div>

                                <div className="mt-2 flex items-center space-x-3">
                                    <div className="bg-gray-100 p-1 rounded-md flex items-center justify-center">
                                        <Payment color="primary" />
                                    </div>
                                    <p className="text-sm">Pay with Stripe</p>

                                    <div className="bg-gray-100 p-1 rounded-md flex items-center justify-center">
                                        <LocalAtm color="primary" />
                                    </div>
                                    <p className="text-sm">Pay with Cash</p>
                                </div>

                                <div className="mt-4 flex items-center">
                                    <DetailsCartWishlistButtons
                                        handleAction={handleAction}
                                        isCartLoading={isCartLoading}
                                        isWishlistLoading={isWishlistLoading}
                                        inventoryCount={product.inventoryCount}
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

                    <AddReviewModal
                        open={isReviewModalOpen}
                        onClose={() => setIsReviewModalOpen(false)}
                        product={product}
                        onReviewSuccess={handleReviewSuccess}
                    />

                    <Footer />
                </>
            )}
        </>
    );
};

export default ProductDetails;