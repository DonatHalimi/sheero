import '@splidejs/splide/dist/css/splide.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomPagination, FilterLayout, ProductItemSkeleton, SplideList } from '../../assets/CustomComponents';
import noProducts from '../../assets/img/products/no-products.png';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import ProductItem from '../../components/Product/ProductItem';
import { getApiUrl } from '../../config';

const itemsPerPage = 40;

const ProductsByCategory = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingSubcategories, setLoadingSubcategories] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });

    const navigate = useNavigate();

    const fetchSubcategories = async (categoryId) => {
        setLoadingSubcategories(true);
        if (!subcategories[categoryId]) {
            try {
                const { data } = await axios.get(getApiUrl(`/subcategories/get-by-category/${categoryId}`));
                setSubcategories(prev => ({ ...prev, [categoryId]: data }));
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            } finally {
                setLoadingSubcategories(false);
            }
        } else {
            setLoadingSubcategories(false);
        }
    };

    useEffect(() => {
        const fetchProductsAndCategory = async () => {
            setLoading(true);
            try {
                const categoryResponse = await axios.get(getApiUrl(`/categories/get/${id}`));
                setCategoryName(categoryResponse.data.name);

                await fetchSubcategories(id);

                const productsResponse = await axios.get(getApiUrl(`/products/get-by-category/${id}`));
                setProducts(productsResponse.data.products);
                setFilteredProducts(productsResponse.data.products);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching products or category:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndCategory();
    }, [id]);

    const handleApplyPriceFilter = (range) => {
        setPriceFilter(range);

        let filtered = [...products];

        filtered = filtered.filter(product => {
            const priceToCheck = product.salePrice || product.price;
            if (range.min && priceToCheck < parseFloat(range.min)) return false;
            if (range.max && priceToCheck > parseFloat(range.max)) return false;
            return true;
        });

        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSubcategoryClick = (subcategoryId) => {
        navigate(`/subcategory/${subcategoryId}`);
    };

    return (
        <>
            <Navbar />
            <FilterLayout
                loading={loading}
                products={filteredProducts}
                noProducts={noProducts}
                breadcrumbType="category"
                breadcrumbData={{ name: categoryName, _id: id }}
                onApplyPriceFilter={handleApplyPriceFilter}
            >
                <div className="mb-16 bg-gray-50">
                    <SplideList
                        items={subcategories}
                        id={id}
                        loading={loadingSubcategories}
                        showImage={true}
                        onCardClick={handleSubcategoryClick}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                        {loading ? (
                            <ProductItemSkeleton />
                        ) : (
                            getCurrentPageItems().map(product => (
                                <ProductItem key={product._id} product={product} />
                            ))
                        )}
                    </div>

                    <div className="flex justify-start">
                        {!loading && filteredProducts.length > 0 && (
                            <CustomPagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange}
                                size="medium"
                                sx={{
                                    position: 'relative',
                                    bottom: '-2px',
                                }}
                            />
                        )}
                    </div>
                </div>
            </FilterLayout>
            <Footer />
        </>
    );
};

export default ProductsByCategory;