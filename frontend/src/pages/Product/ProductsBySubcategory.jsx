import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import noProducts from '../../assets/img/products/no-products.png';
import { CustomPagination } from '../../components/custom/MUI';
import { FilterLayout, ProductGrid } from '../../components/custom/Product';
import { SplideList } from '../../components/custom/Splide';
import { calculatePageCount, filterProductsByPrice, getPaginatedItems, handlePageChange, sortProducts } from '../../components/custom/utils';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { getSubSubcategoriesBySubcategoryService } from '../../services/categoryService';
import { getProductsBySubcategoryService } from '../../services/productService';
import { getSubcategoryBySlugService } from '../../services/subcategoryService';

const itemsPerPage = 40;

const ProductsBySubcategory = () => {
    const { slug } = useParams();

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

    const fetchSubSubcategories = async (subcategorySlug) => {
        setLoadingSubSubcategories(true);
        if (!subsubcategories[subcategorySlug]) {
            try {
                const { data } = await getSubSubcategoriesBySubcategoryService(subcategorySlug);
                setSubsubcategories((prev) => ({ ...prev, [subcategorySlug]: data }));
            } catch (error) {
                console.error('Error fetching subsubcategories:', error);
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
                const subcategoryResponse = await getSubcategoryBySlugService(slug);
                setSubcategoryData(subcategoryResponse.data);

                await fetchSubSubcategories(slug);

                const productsResponse = await getProductsBySubcategoryService(slug);
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

    const handleSubSubcategoryClick = (subSubcategorySlug) => {
        navigate(`/subSubcategory/${subSubcategorySlug}`);
    };

    const breadcrumbData = {
        name: subcategoryData?.name || '',
        slug: slug,
        category: {
            slug: subcategoryData?.category?.slug || '',
            name: subcategoryData?.category?.name || '',
        },
    };

    return (
        <>
            <Navbar activeCategory={subcategoryData?.category?.slug} />
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
                        id={slug}
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