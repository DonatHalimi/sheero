import { KeyboardArrowDown } from '@mui/icons-material';
import { CircularProgress, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { BrownButton } from '../../components/custom/MUI';
import { ProductGrid } from '../../components/custom/Product';
import { getProductsPaginatedService, ITEMS_PER_PAGE } from '../../services/productService';
import { getPaginatedProducts } from '../../store/actions/productActions';

const ProductList = () => {
    const dispatch = useDispatch();
    const { paginatedProducts, pagination, paginatedLoading } = useSelector((state) => state.products);

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [autoLoadEnabled, setAutoLoadEnabled] = useState(false);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0.1,
        rootMargin: '100px'
    });

    const fetchProducts = useCallback(async (page = 1, append = true) => {
        try {
            if (page === 1) {
                setProducts([]);
            }

            setIsLoadingMore(true);

            const response = await getProductsPaginatedService(page, ITEMS_PER_PAGE);

            if (response.data && response.data.success) {
                const newProducts = response.data.products;

                if (append && page > 1) {
                    setProducts(prev => [...prev, ...newProducts]);
                } else {
                    setProducts(newProducts);
                }

                setHasNextPage(response.data.pagination.hasNextPage);
                setTotalProducts(response.data.pagination.totalProducts);
                setCurrentPage(page);
            } else {
                throw new Error(response.data?.message);
            }
        } catch (err) {
            setHasNextPage(false);
        } finally {
            setIsLoadingMore(false);
        }
    }, []);

    const handleLoadMore = useCallback(() => {
        if (!isLoadingMore && hasNextPage) {
            fetchProducts(currentPage + 1, true);
        }
    }, [currentPage, hasNextPage, isLoadingMore, fetchProducts]);

    const enableAutoLoad = useCallback(() => {
        setAutoLoadEnabled(true);
        handleLoadMore();
    }, [handleLoadMore]);

    useEffect(() => {
        if (!isInitialized) {
            if (paginatedProducts.length > 0 && pagination.currentPage === 1) {
                setProducts(paginatedProducts);
                setCurrentPage(pagination.currentPage);
                setHasNextPage(pagination.hasNextPage);
                setTotalProducts(pagination.totalProducts);
                setIsInitialized(true);
            } else {
                dispatch(getPaginatedProducts(1, ITEMS_PER_PAGE));
            }
        }
    }, [dispatch, paginatedProducts, pagination, isInitialized]);

    useEffect(() => {
        if (!isInitialized && paginatedProducts.length > 0 && pagination.currentPage === 1) {
            setProducts(paginatedProducts);
            setCurrentPage(pagination.currentPage);
            setHasNextPage(pagination.hasNextPage);
            setTotalProducts(pagination.totalProducts);
            setIsInitialized(true);
        }
    }, [paginatedProducts, pagination, isInitialized]);

    useEffect(() => {
        if (inView && autoLoadEnabled && hasNextPage && !isLoadingMore) {
            handleLoadMore();
        }
    }, [inView, autoLoadEnabled, hasNextPage, isLoadingMore, handleLoadMore]);

    const isInitialLoading = (paginatedLoading || !isInitialized) && products.length === 0;

    return (
        <div className="container mx-auto p-4 pr-6 mb-16 bg-gray-50">
            <ProductGrid
                loading={isInitialLoading}
                currentPageItems={products}
                isMainPage={true}
            />

            {hasNextPage && (
                <div ref={loadMoreRef} className="flex justify-center mt-6">
                    {!autoLoadEnabled ? (
                        <BrownButton
                            variant="contained"
                            onClick={enableAutoLoad}
                            endIcon={<KeyboardArrowDown />}
                            disabled={isLoadingMore}
                        >
                            {isLoadingMore ? 'Loading...' : 'Load More Products'}
                        </BrownButton>
                    ) : (
                        <div className="flex flex-col items-center">
                            <CircularProgress size={24} />
                        </div>
                    )}
                </div>
            )}

            {!hasNextPage && products.length > 0 && (
                <div className="flex flex-col items-center mt-6">
                    <Typography variant="body1" color="textSecondary">
                        End of Results
                    </Typography>
                    <Typography variant="caption" color="textSecondary" className="mt-1">
                        Showing all {totalProducts} products
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default ProductList;