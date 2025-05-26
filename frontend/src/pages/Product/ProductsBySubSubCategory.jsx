import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import noProducts from '../../assets/img/products/no-products.png';
import { CustomPagination } from '../../components/custom/MUI';
import { FilterLayout, ProductGrid } from '../../components/custom/Product';
import { SplideList } from '../../components/custom/Splide';
import { calculatePageCount, filterProductsByPrice, getPaginatedItems, handlePageChange, sortProducts } from '../../components/custom/utils';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { getCategoryBySlugService } from '../../services/categoryService';
import { getProductsBySubSubcategoryService } from '../../services/productService';
import { getSubcategoryBySlugService } from '../../services/subcategoryService';
import { getSubSubcategoryBySlugService } from '../../services/subSubcategoryService';

const itemsPerPage = 40;

const ProductsBySubSubCategory = () => {
    const { slug } = useParams();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [subSubcategoryData, setSubsubcategoryData] = useState(null);
    const [subcategoryData, setSubcategoryData] = useState(null);
    const [categoryData, setCategoryData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
    const [sortOrder, setSortOrder] = useState('relevancy');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const subSubcategoryResponse = await getSubSubcategoryBySlugService(slug);
                setSubsubcategoryData(subSubcategoryResponse.data);

                if (subSubcategoryResponse.data?.subcategory?.slug) {
                    const subcategoryResponse = await getSubcategoryBySlugService(subSubcategoryResponse.data.subcategory.slug);
                    setSubcategoryData(subcategoryResponse.data);

                    if (subcategoryResponse.data?.category?.slug) {
                        const categoryResponse = await getCategoryBySlugService(subcategoryResponse.data.category.slug);
                        setCategoryData(categoryResponse.data);
                    }
                }

                const productsResponse = await getProductsBySubSubcategoryService(slug);
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

    const breadcrumbData = {
        name: subSubcategoryData?.name || '',
        slug: subSubcategoryData?.slug || '',
        category: {
            slug: categoryData?.slug || '',
            name: categoryData?.name || '',
        },
        subcategory: {
            slug: subcategoryData?.slug || '',
            name: subcategoryData?.name || '',
        },
    };

    return (
        <>
            <Navbar activeCategory={categoryData?.slug} />
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