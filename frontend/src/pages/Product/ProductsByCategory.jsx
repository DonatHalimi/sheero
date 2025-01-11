import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calculatePageCount, CustomPagination, FilterLayout, filterProductsByPrice, getPaginatedItems, handlePageChange, ProductGrid, sortProducts, SplideList } from '../../assets/CustomComponents';
import noProducts from '../../assets/img/products/no-products.png';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { getApiUrl } from '../../utils/config';

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
    const [sortOrder, setSortOrder] = useState('relevancy');

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
        setFilteredProducts(filterProductsByPrice(products, range));
        setCurrentPage(1);
    };

    const handleSortChange = (event) => {
        const order = event.target.value;
        setSortOrder(order);

        if (order === 'relevancy') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(sortProducts(filteredProducts, order));
        }
        setCurrentPage(1);
    };

    const pageCount = calculatePageCount(filteredProducts, itemsPerPage);
    const currentPageItems = getPaginatedItems(filteredProducts, currentPage, itemsPerPage);

    const handleSubcategoryClick = (subcategoryId) => {
        navigate(`/subcategory/${subcategoryId}`);
    };

    const breadcrumbData = { name: categoryName, _id: id }

    return (
        <>
            <Navbar />
            <FilterLayout
                loading={loading}
                products={filteredProducts}
                noProducts={noProducts}
                breadcrumbType="category"
                breadcrumbData={breadcrumbData}
                onApplyPriceFilter={handleApplyPriceFilter}
            >
                <div className="mb-16 bg-gray-50">
                    <SplideList
                        items={subcategories}
                        id={id}
                        loading={loadingSubcategories}
                        onCardClick={handleSubcategoryClick}
                        showImage={true}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                    />

                    <ProductGrid loading={loading} currentPageItems={currentPageItems} />

                    <div className="flex justify-start">
                        {!loading && filteredProducts.length > 0 && (
                            <CustomPagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange(setCurrentPage)}
                                size="medium"
                                sx={{ position: 'relative', bottom: '-2px' }}
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