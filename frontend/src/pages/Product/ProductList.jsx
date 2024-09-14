import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CustomPagination } from '../../assets/CustomComponents';
import ProductItem from '../../components/Product/ProductItem';

const apiUrl = 'http://localhost:5000/api/products';
const itemsPerPage = 10;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/get`);
                setProducts(response.data.products);
                setTotalProducts(response.data.products.length);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const pageCount = Math.ceil(totalProducts / itemsPerPage);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const renderProductItems = () => (
        loading
            ? Array.from({ length: totalProducts }, (_, index) => <ProductItem key={index} loading={true} />)
            : getCurrentPageItems().map(product => <ProductItem key={product._id} product={product} loading={false} />)
    );

    return (
        <div className="container mx-auto px-4 py-8 mb-16 bg-gray-50">
            {totalProducts > 0 && (
                <div className="sticky top-0 z-10 pb-4 bg-gray-50">
                    <h1 className="text-2xl font-semibold">Products</h1>
                </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {renderProductItems()}
            </div>
            {totalProducts > 0 && (
                <CustomPagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default ProductList;
