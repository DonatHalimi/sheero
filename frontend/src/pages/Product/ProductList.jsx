import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { calculatePageCount, CustomPagination, getPaginatedItems, ProductGrid, ProductItemSkeleton } from '../../assets/CustomComponents';
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

    const scrollToProductGrid = () => {
        const offset = 100;
        const scrollPosition = document.getElementById('product-grid')?.getBoundingClientRect().top + window.scrollY - offset;

        if (scrollPosition) window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
        scrollToProductGrid();
    };

    const pageCount = calculatePageCount(products, itemsPerPage);
    const currentPageItems = getPaginatedItems(products, currentPage, itemsPerPage);

    return (
        <div id="product-grid" className="container mx-auto p-4 pr-6 mb-16 bg-gray-50">

            <ProductGrid loading={loading} currentPageItems={currentPageItems} isMainPage={true} />

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