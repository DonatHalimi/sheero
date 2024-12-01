import { KeyboardArrowDown } from '@mui/icons-material';
import { CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { BrownButton, ProductGrid } from '../../assets/CustomComponents';
import { getProducts } from '../../store/actions/productActions';

const initialItems = 49;

const ProductList = () => {
    const { products, loading } = useSelector((state) => state.products);
    const dispatch = useDispatch();

    const [visibleProducts, setVisibleProducts] = useState(initialItems);
    const [autoLoadEnabled, setAutoLoadEnabled] = useState(false);

    const { ref: loadMoreRef, inView } = useInView({ threshold: 1 });

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const handleLoadMore = () => {
        setVisibleProducts((prev) => Math.min(prev + initialItems, products.length));
    };

    const enableAutoLoad = () => {
        setAutoLoadEnabled(true);
        handleLoadMore();
    };

    useEffect(() => {
        if (inView && autoLoadEnabled && visibleProducts < products.length) {
            handleLoadMore();
        }
    }, [inView, autoLoadEnabled, visibleProducts, products.length]);

    return (
        <div className="container mx-auto p-4 pr-6 mb-16 bg-gray-50">
            <ProductGrid loading={loading} currentPageItems={products.slice(0, visibleProducts)} isMainPage={true} />

            {!loading && visibleProducts < products.length && (
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

            {!loading && visibleProducts >= products.length && (
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