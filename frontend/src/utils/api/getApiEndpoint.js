export const getApiEndpoint = (entityName) => {
    const lowerEntityName = entityName.toLowerCase();

    const endpointMap = {
        'address': '/addresses',
        'category': '/categories',
        'city': '/cities',
        'contact': '/contact',
        'country': '/countries',
        'faq': '/faqs',
        'order': '/orders',
        'product': '/products',
        'return': '/returns',
        'review': '/reviews',
        'role': '/roles',
        'slideshow': '/slideshow',
        'subcategory': '/subcategories',
        'subsubcategory': '/subsubcategories',
        'subscription': '/products/subscriptions',
        'supplier': '/suppliers',
        'user': '/users',
    };

    return endpointMap[lowerEntityName] || `/${entityName.toLowerCase()}s`;
};