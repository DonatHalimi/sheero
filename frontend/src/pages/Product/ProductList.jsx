import { KeyboardArrowDown } from '@mui/icons-material';
import { CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { BrownButton, ProductGrid } from '../../assets/CustomComponents';
import { getApiUrl } from '../../config';

const initalItems = 39;

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalProducts, setTotalProducts] = useState(0);
    const [visibleProducts, setVisibleProducts] = useState(initalItems);
    const [autoLoadEnabled, setAutoLoadEnabled] = useState(false);

    const { ref: loadMoreRef, inView } = useInView({ threshold: 1 });

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

    useEffect(() => {
        if (inView && autoLoadEnabled && visibleProducts < totalProducts) {
            handleLoadMore();
        }
    }, [inView]);

    const handleLoadMore = () => {
        setVisibleProducts((prev) => Math.min(prev + initalItems, totalProducts));
    };

    const enableAutoLoad = () => {
        setAutoLoadEnabled(true);
        handleLoadMore();
    };

    return (
        <div id="product-grid" className="container mx-auto p-4 pr-6 mb-16 bg-gray-50">
            <ProductGrid loading={loading} currentPageItems={products.slice(0, visibleProducts)} isMainPage={true} />

            {loading && (
                <div className="flex justify-center mt-6">
                    <CircularProgress />
                </div>
            )}

            {!loading && visibleProducts < totalProducts && (
                <div ref={loadMoreRef} className="flex justify-center mt-6">
                    {!autoLoadEnabled ? (
                        <BrownButton
                            variant="contained"
                            onClick={enableAutoLoad}
                            endIcon={<KeyboardArrowDown />}
                        >
                            Load More Products
                        </BrownButton>
                    ) : (
                        <CircularProgress />
                    )}
                </div>
            )}

            {!loading && visibleProducts >= totalProducts && (
                <div className="flex justify-center mt-6">
                    <Typography variant="body1" color="textSecondary">
                        End of Results
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default ProductList;