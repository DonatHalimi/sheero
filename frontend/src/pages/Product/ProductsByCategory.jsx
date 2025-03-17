import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calculatePageCount, CustomPagination, FilterLayout, filterProductsByPrice, getPaginatedItems, handlePageChange, ProductGrid, sortProducts, SplideList } from '../../assets/CustomComponents';
import noProducts from '../../assets/img/products/no-products.png';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { getCategoryBySlugService, getSubcategoriesByCategoryService } from '../../services/categoryService';
import { getProductsByCategoryService } from '../../services/productService';

const itemsPerPage = 40;

const ProductsByCategory = () => {
    const { slug } = useParams();

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

    const fetchSubcategories = async (categorySlug) => {
        setLoadingSubcategories(true);
        if (!subcategories[categorySlug]) {
            try {
                const { data } = await getSubcategoriesByCategoryService(categorySlug);
                setSubcategories((prev) => ({ ...prev, [categorySlug]: data }));
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
                const categoryResponse = await getCategoryBySlugService(slug);
                setCategoryName(categoryResponse.data.name);

                await fetchSubcategories(slug);

                const productsResponse = await getProductsByCategoryService(categoryResponse.data._id);
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
    }, [slug]);

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

    const handleSubcategoryClick = (subcategorySlug) => {
        navigate(`/subcategory/${subcategorySlug}`);
    };

    const breadcrumbData = { name: categoryName, slug: slug };

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
                        id={slug}
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