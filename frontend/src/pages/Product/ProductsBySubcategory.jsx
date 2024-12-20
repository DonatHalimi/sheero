import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { calculatePageCount, CustomPagination, FilterLayout, filterProductsByPrice, getPaginatedItems, handlePageChange, ProductGrid, sortProducts, SplideList } from '../../assets/CustomComponents';
import noProducts from '../../assets/img/products/no-products.png';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { getApiUrl } from '../../config';

const itemsPerPage = 40;

const ProductsBySubcategory = () => {
    const { id } = useParams();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [subsubcategories, setSubsubcategories] = useState({});
    const [subcategoryData, setSubcategoryData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingSubSubcategories, setLoadingSubSubcategories] = useState(true);
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
    const [sortOrder, setSortOrder] = useState('relevancy');

    const navigate = useNavigate();

    const fetchSubSubcategories = async (subcategoryId) => {
        setLoadingSubSubcategories(true);
        if (!subsubcategories[subcategoryId]) {
            try {
                const { data } = await axios.get(getApiUrl(`/subsubcategories/get-by-subCategory/${subcategoryId}`));
                setSubsubcategories(prev => ({ ...prev, [subcategoryId]: data }));
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            } finally {
                setLoadingSubSubcategories(false);
            }
        } else {
            setLoadingSubSubcategories(false);
        }
    };

    useEffect(() => {
        const fetchProductsAndSubcategory = async () => {
            setLoading(true);
            try {
                const subcategoryResponse = await axios.get(getApiUrl(`/subcategories/get/${id}`));
                setSubcategoryData(subcategoryResponse.data);

                await fetchSubSubcategories(id);

                const productsResponse = await axios.get(getApiUrl(`/products/get-by-subcategory/${id}`));
                setProducts(productsResponse.data.products);
                setFilteredProducts(productsResponse.data.products);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching products or subcategory:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndSubcategory();
    }, [id]);

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

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

    const handleSubSubcategoryClick = (subSubcategoryId) => {
        navigate(`/subSubcategory/${subSubcategoryId}`);
    };

    const breadcrumbData = {
        name: subcategoryData?.name || '',
        _id: id,
        category: {
            _id: subcategoryData?.category?._id || '',
            name: subcategoryData?.category?.name || '',
        },
    }

    return (
        <>
            <Navbar />
            <FilterLayout
                loading={loading}
                products={filteredProducts}
                noProducts={noProducts}
                breadcrumbType="subcategory"
                breadcrumbData={breadcrumbData}
                onApplyPriceFilter={handleApplyPriceFilter}
            >
                <div className="mb-16 bg-gray-50">
                    <SplideList
                        items={subsubcategories}
                        id={id}
                        loading={loadingSubSubcategories}
                        showImage={false}
                        onCardClick={handleSubSubcategoryClick}
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

export default ProductsBySubcategory;