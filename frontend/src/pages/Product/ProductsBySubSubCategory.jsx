import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomPagination, FilterLayout, ProductItemSkeleton, SplideList } from '../../assets/CustomComponents';
import noProducts from '../../assets/img/products/no-products.png';
import Footer from '../../components/Utils/Footer';
import Navbar from '../../components/Navbar/Navbar';
import ProductItem from '../../components/Product/ProductItem';
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

    return (
        <>
            <Navbar />
            <FilterLayout
                loading={loading}
                products={filteredProducts}
                noProducts={noProducts}
                breadcrumbType="subSubcategory"
                breadcrumbData={{
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
                }}
                onApplyPriceFilter={handleApplyPriceFilter}
            >
                <div className="mb-16 bg-gray-50">

                    <SplideList
                        showSplide={false}
                        showTopStyle={false}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
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

                    {!loading && filteredProducts.length > 0 && (
                        <CustomPagination
                            count={pageCount}
                            page={currentPage}
                            onChange={handlePageChange}
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
