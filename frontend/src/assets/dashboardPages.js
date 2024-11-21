import React from 'react';

const pages = {
    addresses: React.lazy(() => import('../pages/Dashboard/AddressesPage')),
    categories: React.lazy(() => import('../pages/Dashboard/CategoriesPage')),
    cities: React.lazy(() => import('../pages/Dashboard/CitiesPage')),
    contacts: React.lazy(() => import('../pages/Dashboard/ContactPage')),
    countries: React.lazy(() => import('../pages/Dashboard/CountriesPage')),
    faqs: React.lazy(() => import('../pages/Dashboard/FAQPage')),
    images: React.lazy(() => import('../pages/Dashboard/SlideshowPage')),
    main: React.lazy(() => import('../pages/Dashboard/DashboardContent')),
    orders: React.lazy(() => import('../pages/Dashboard/OrdersPage')),
    products: React.lazy(() => import('../pages/Dashboard/ProductsPage')),
    returns: React.lazy(() => import('../pages/Dashboard/ReturnsPage')),
    reviews: React.lazy(() => import('../pages/Dashboard/ReviewsPage')),
    roles: React.lazy(() => import('../pages/Dashboard/RolesPage')),
    subcategories: React.lazy(() => import('../pages/Dashboard/SubcategoriesPage')),
    subSubcategories: React.lazy(() => import('../pages/Dashboard/SubSubcategoriesPage')),
    suppliers: React.lazy(() => import('../pages/Dashboard/SuppliersPage')),
    users: React.lazy(() => import('../pages/Dashboard/UsersPage')),
};

export default pages;