import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import emptyCartImage from '../../assets/img/empty/cart.png';
import { LoadingCart } from '../../components/custom/LoadingSkeletons';
import { CustomDeleteModal, NotFound } from '../../components/custom/MUI';
import { CartHeader, CartProducts, CartSummary } from '../../components/custom/Product';
import Navbar from '../../components/Navbar/Navbar';
import PaymentModal from '../../components/Product/Modals/PaymentModal';
import Footer from '../../components/Utils/Footer';
import { clearCartService, createStripeSessionService, getCartService, makeCashPaymentService, removeFromCartService, updateQuantityService } from '../../services/cartService';
import { getUserAddress } from '../../store/actions/addressActions';
import { getCartCount } from '../../store/actions/cartActions';

const Cart = () => {
    const { address } = useSelector((state) => state.address);
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [cart, setCart] = useState({ items: [] });
    const [openModal, setOpenModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [loading, setLoading] = useState({
        initial: true,
        clear: false,
        actions: {}
    });

    const updateCartState = (data) => {
        setCart(data);
        document.dispatchEvent(new CustomEvent('cartUpdated', { detail: data }));
        dispatch(getCartCount());
    };

    const setLoadingFlag = (key, value) => {
        if (key === 'actions') {
            setLoading(prev => ({
                ...prev,
                actions: { ...prev.actions, ...value }
            }));
        } else {
            setLoading(prev => ({ ...prev, [key]: value }));
        }
    };

    const shippingCost = 2;
    const calculateTotalPrice = () => (cart?.items || []).reduce((total, item) => total + item.quantity * (item.product.salePrice || item.product.price), 0);
    const handleProductClick = (slug) => navigate(`/${slug}`);

    const subtotal = calculateTotalPrice();
    const total = subtotal + shippingCost;
    const productLabel = cart?.items?.length > 1 ? 'Products' : 'Product';

    const fetchCart = async () => {
        setLoadingFlag('initial', true);

        try {
            const response = await getCartService();
            setCart(response.data);
        } catch (error) {
            setCart({ items: [] });
        } finally {
            setLoadingFlag('initial', false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
            dispatch(getUserAddress(user.id));
        }
    }, [user]);

    useEffect(() => {
        const handleCartUpdate = () => fetchCart();
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const updateQuantity = async (productId, quantityChange) => {
        const actionType = quantityChange > 0 ? 'increment' : 'decrement';
        setLoadingFlag('actions', {
            [productId]: {
                ...loading.actions[productId],
                update: actionType
            }
        });

        const data = { productId, quantityChange };

        try {
            const response = await updateQuantityService(data);
            updateCartState(response.data);
        } finally {
            setLoadingFlag('actions', {
                [productId]: {
                    ...loading.actions[productId],
                    update: false
                }
            });
        }
    };

    const handleRemove = async (productId) => {
        setLoadingFlag('actions', {
            [productId]: {
                ...loading.actions[productId],
                remove: true
            }
        });

        try {
            const response = await removeFromCartService(productId);

            if (response.data.success) {
                updateCartState(response.data.cart);
                toast.success(response.data.message);
            } else {
                const res = await getCartService();
                updateCartState(res.data);
            }
        } finally {
            setLoadingFlag('actions', {
                [productId]: {
                    ...loading.actions[productId],
                    remove: false
                }
            });
        }
    };

    const handleClearCart = async () => {
        setLoadingFlag('clear', true);

        try {
            const response = await clearCartService();
            updateCartState(response.data);

            toast.success(response.data.message, {
                onClick: () => navigate('/'),
            });
        } finally {
            setLoadingFlag('clear', false);
            setOpenModal(false);
        }
    };

    const handleShowModal = () => {
        if (!address) {
            toast.warn("No address found. Click here to add one", {
                onClick: () => navigate('/profile/address'),
                autoClose: false,
            });
            return;
        }
        setShowPaymentModal(true);
    };

    const handleStripePayment = async () => {
        const data = {
            cartId: cart._id,
            addressId: address._id,
            userId: user.id,
            email: user.email,
        };

        try {
            const response = await createStripeSessionService(data);

            setShowPaymentModal(false);
            window.location.href = response.data.url;
        } catch (error) {
            toast.error("Failed to initiate checkout. Please try again.");
        }
    };

    const handleCashPayment = async () => {
        const data = {
            cartId: cart._id,
            addressId: address._id,
            userId: user.id,
        };

        try {
            const response = await makeCashPaymentService(data);

            if (response.data.success) {
                await clearCartService();
                toast.success(response.data.message);
                setShowPaymentModal(false);

                const orderId = response.data.order._id;
                navigate(`/profile/orders/${orderId}`);
            }
        } catch (error) {
            toast.error("Failed to place the order. Please try again.");
            setShowPaymentModal(false);
        }
    };

    if (loading.initial) return <LoadingCart />;

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 lg:px-24 py-2 mb-16 bg-gray-50 mt-10">
                <CartHeader cart={cart} setOpenModal={setOpenModal} />

                {cart?.items?.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-6">
                        <CartProducts
                            cart={cart}
                            productLabel={productLabel}
                            setOpenModal={setOpenModal}
                            updateQuantity={updateQuantity}
                            handleRemove={handleRemove}
                            handleProductClick={handleProductClick}
                            loadingActions={loading.actions}
                        />

                        <CartSummary
                            cart={cart}
                            subtotal={subtotal}
                            total={total}
                            shippingCost={shippingCost}
                            handleShowModal={handleShowModal}
                        />
                    </div>
                ) : (
                    <NotFound imageSrc={emptyCartImage} message="Your cart is empty." />
                )}
            </div>

            <PaymentModal
                open={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onStripePayment={handleStripePayment}
                onCashPayment={handleCashPayment}
            />

            <CustomDeleteModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onDelete={handleClearCart}
                title="Clear Cart"
                message="Are you sure you want to clear the cart?"
                loading={loading.clear}
                disabled={loading.clear}
            />

            <Footer />
        </>
    );
};

export default Cart;