import React from 'react';

// React and Router imports
export { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Toast imports
export { ToastContainer } from 'react-toastify';

// Utility components
export { default as ProtectedRoute } from '../components/Route/ProtectedRoute';
export { default as PublicRoute } from '../components/Route/PublicRoute';
export { default as ToTop } from '../components/Utils/ToTop';

// Lazy-loaded components
export const Home = React.lazy(() => import('../pages/Info/Home'));
export const Login = React.lazy(() => import('../pages/Auth/Login'));
export const Register = React.lazy(() => import('../pages/Auth/Register'));
export const FAQs = React.lazy(() => import('../pages/Info/FAQs'));
export const NotAllowed = React.lazy(() => import('../pages/Errors/NotAllowed'));
export const NotFound = React.lazy(() => import('../pages/Errors/NotFound'));
export const AboutUs = React.lazy(() => import('../pages/Info/AboutUs'));
export const ContactUs = React.lazy(() => import('../pages/Info/ContactUs'));
export const ProductsByCategory = React.lazy(() => import('../pages/Product/ProductsByCategory'));
export const ProductsBySubcategory = React.lazy(() => import('../pages/Product/ProductsBySubcategory'));
export const ProductsBySubSubCategory = React.lazy(() => import('../pages/Product/ProductsBySubSubCategory'));
export const ProductDetails = React.lazy(() => import('../pages/Product/ProductDetails'));
export const SearchResults = React.lazy(() => import('../pages/Product/SearchResults'));
export const SharedWishlist = React.lazy(() => import('../components/Product/Utils/SharedWishlist'));
export const DashboardLayout = React.lazy(() => import('../components/Dashboard/DashboardLayout'));
export const Cart = React.lazy(() => import('../pages/Product/Cart'));
export const Profile = React.lazy(() => import('../pages/Profile/ProfileInformation'));
export const Addresses = React.lazy(() => import('../pages/Profile/AddressInformation'));
export const Orders = React.lazy(() => import('../pages/Profile/Orders'));
export const OrderDetails = React.lazy(() => import('../pages/Profile/OrderDetails'));
export const Returns = React.lazy(() => import('../pages/Profile/Returns'));
export const ReturnDetails = React.lazy(() => import('../pages/Profile/ReturnDetails'));
export const Wishlist = React.lazy(() => import('../pages/Profile/Wishlist'));
export const Reviews = React.lazy(() => import('../pages/Profile/Reviews'));
export const Verify = React.lazy(() => import('../components/Payment/Verify'));