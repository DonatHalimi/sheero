import '@splidejs/splide/dist/css/splide.min.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomPagination, FilterLayout, ProductItemSkeleton, SplideList } from '../../assets/CustomComponents';
import noProducts from '../../assets/img/products/no-products.png';
import Footer from '../../components/Utils/Footer';
import Navbar from '../../components/Navbar/Navbar';
import ProductItem from '../../components/Product/ProductItem';
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

    useEffect(() => window.scrollTo(0, 0), [id])

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

    const handleSortChange = (event) => {
        const order = event.target.value;
        setSortOrder(order);
        let sortedProducts = [...filteredProducts];

        switch (order) {
            case 'lowToHigh':
                sortedProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
                break;
            case 'highToLow':
                sortedProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
                break;
            case 'newest':
                sortedProducts.sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));
                break;
            case 'highestSale':
                sortedProducts.sort((a, b) => (b.discount?.value || 0) - (a.discount?.value || 0));
                break;
            default:
                sortedProducts = products;
                break;
        }

        setFilteredProducts(sortedProducts);
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

    const handleSubSubcategoryClick = (subSubcategoryId) => {
        navigate(`/subSubcategory/${subSubcategoryId}`);
    };

    return (
        <>
            <Navbar />
            <FilterLayout
                loading={loading}
                products={filteredProducts}
                noProducts={noProducts}
                breadcrumbType="subcategory"
                breadcrumbData={{
                    name: subcategoryData?.name || '',
                    _id: id,
                    category: {
                        _id: subcategoryData?.category?._id || '',
                        name: subcategoryData?.category?.name || '',
                    },
                }}
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
                        showTopStyle={true}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6">
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

export default ProductsBySubcategory;