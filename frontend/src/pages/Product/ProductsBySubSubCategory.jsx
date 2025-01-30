import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { calculatePageCount, CustomPagination, FilterLayout, filterProductsByPrice, getPaginatedItems, handlePageChange, ProductGrid, sortProducts, SplideList } from '../../assets/CustomComponents';
import noProducts from '../../assets/img/products/no-products.png';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { getCategoryByIdService } from '../../services/categoryService';
import { getProductsBySubSubcategoryService } from '../../services/productService';
import { getSubSubcategoriesService } from '../../services/subSubcategoryService';

const itemsPerPage = 40;

const ProductsBySubSubCategory = () => {
    const { id } = useParams();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [subSubcategoryData, setSubsubcategoryData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
    const [sortOrder, setSortOrder] = useState('relevancy');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const subSubcategoryResponse = await getSubSubcategoriesService(id);
                const subSubcategories = subSubcategoryResponse.data;

                const subSubcategoryData = subSubcategories.find(
                    (item) => item._id === id
                );

                setSubsubcategoryData(subSubcategoryData);

                if (subSubcategoryData.subcategory?.category) {
                    const categoryResponse = await getCategoryByIdService(subSubcategoryData.subcategory.category);
                    setCategoryData(categoryResponse.data);
                }

                const productsResponse = await getProductsBySubSubcategoryService(id);
                setProducts(productsResponse.data.products);
                setFilteredProducts(productsResponse.data.products);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    const breadcrumbData = {
        name: subSubcategoryData?.name || '',
        _id: id,
        category: {
            _id: categoryData?._id || '',
            name: categoryData?.name || '',
        },
        subcategory: {
            _id: subSubcategoryData?.subcategory?._id || '',
            name: subSubcategoryData?.subcategory?.name || '',
        },
    };

    return (
        <>
            <Navbar />
            <FilterLayout
                loading={loading}
                products={filteredProducts}
                noProducts={noProducts}
                breadcrumbType="subSubcategory"
                breadcrumbData={breadcrumbData}
                onApplyPriceFilter={handleApplyPriceFilter}
            >
                <div className="mb-16 bg-gray-50">
                    <SplideList
                        showSplide={false}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                        showTopStyle={false}
                    />

                    <ProductGrid loading={loading} currentPageItems={currentPageItems} />

                    {!loading && filteredProducts.length > 0 && (
                        <CustomPagination
                            count={pageCount}
                            page={currentPage}
                            onChange={handlePageChange(setCurrentPage)}
                            sx={{ position: 'relative', bottom: '-2px' }}
                        />
                    )}
                </div>
            </FilterLayout>
            <Footer />
        </>
    );
};

export default ProductsBySubSubCategory;