import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CustomPagination } from '../../assets/CustomComponents';
import ProductItem from '../../components/ProductItem';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get('http://localhost:5000/api/products/get')
            .then(response => setProducts(response.data.products))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const pageCount = Math.ceil(products.length / itemsPerPage);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <div className="container mx-auto px-4 py-8 mb-16 bg-gray-50">
            {products.length > 0 && (
                <div className="sticky top-0 z-10 pb-4 bg-gray-50">
                    <h1 className="text-2xl font-semibold">Products</h1>
                </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {getCurrentPageItems().map(product => (
                    <ProductItem key={product._id} product={product} />
                ))}
            </div>

            <CustomPagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default ProductList;