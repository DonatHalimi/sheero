import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CustomPagination, ProductItemSkeleton } from '../../assets/CustomComponents';
import ProductItem from '../../components/Product/ProductItem';
import { getApiUrl } from '../../config';

const itemsPerPage = 40;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(getApiUrl('/products/get'));
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
        
        // Scroll to the product grid on page change
        document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto p-4 pr-6 mb-16 bg-gray-50">
            <div id="product-grid" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {loading ? (
                    <ProductItemSkeleton />
                ) : (
                    getCurrentPageItems().map(product => (
                        <ProductItem key={product._id} product={product} />
                    ))
                )}
            </div>

            {!loading && totalProducts > 0 && (
                <CustomPagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                        position: 'relative',
                        bottom: '-2px',
                    }}
                />
            )}
        </div>
    );
};

export default ProductList;