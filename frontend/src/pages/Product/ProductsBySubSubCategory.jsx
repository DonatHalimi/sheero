import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { calculatePageCount, CustomPagination, FilterLayout, filterProductsByPrice, getPaginatedItems, handlePageChange, ProductGrid, ProductItemSkeleton, sortProducts, SplideList } from '../../assets/CustomComponents';
import noProducts from '../../assets/img/products/no-products.png';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { getApiUrl } from '../../config';

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

    useEffect(() => window.scrollTo(0, 0), [id])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const subSubcategoryResponse = await axios.get(getApiUrl(`/subsubcategories/get/${id}`));
                const subSubcategoryData = subSubcategoryResponse.data;
                setSubsubcategoryData(subSubcategoryData);

                if (subSubcategoryData.subcategory?.category) {
                    const categoryResponse = await axios.get(
                        getApiUrl(`/categories/get/${subSubcategoryData.subcategory.category}`)
                    );
                    setCategoryData(categoryResponse.data);
                }

                const productsResponse = await axios.get(getApiUrl(`/products/get-by-subSubcategory/${id}`));
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
        setFilteredProducts(sortProducts(filteredProducts, order));
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
    }

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
