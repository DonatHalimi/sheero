import { Skeleton } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomPagination, EmptyState, GoBackButton, ProductItemSkeleton } from '../../assets/CustomComponents';
import noProducts from '../../assets/img/products/no-products.png';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import ProductItem from '../../components/Product/ProductItem';
import { getApiUrl } from '../../config';

const ProductsBySubSubCategory = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [subSubcategoryName, setSubsubcategoryName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 40;

    useEffect(() => {
        const fetchProductsAndCategory = async () => {
            setLoading(true);
            try {
                const subSubcategoryResponse = await axios.get(getApiUrl(`/subsubcategories/get/${id}`));
                setSubsubcategoryName(subSubcategoryResponse.data.name);

                const productsResponse = await axios.get(getApiUrl(`/products/get-by-subSubcategory/${id}`));
                setProducts(productsResponse.data.products);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching products or category:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndCategory();
    }, [id]);

    const pageCount = Math.ceil(products.length / itemsPerPage);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <>
            <Navbar />

            <div className="container mx-auto p-4 mb-16 bg-gray-50 mt-5">
                {products.length > 0 && (
                    <GoBackButton />
                )}

                <div className="sticky top-0 z-10 mb-4 bg-gray-50">
                    {loading ? (
                        <Skeleton variant="text" animation="wave" width={250} height={20} />
                    ) : products.length > 0 ? (
                        <h1 className="text-2xl font-semibold" id='product-container'>
                            Products in {subSubcategoryName}
                        </h1>
                    ) : (
                        <EmptyState
                            imageSrc={noProducts}
                            message="No products found for"
                            dynamicValue={subSubcategoryName}
                            containerClass="p-8 mt-4 mx-14 md:mx-16 lg:mx-72"
                            imageClass="w-32 h-32"
                        />
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {loading ? (
                        <ProductItemSkeleton />
                    ) : (
                        getCurrentPageItems().map(product => (
                            <ProductItem key={product._id} product={product} />
                        ))
                    )}
                </div>

                {!loading && products.length > 0 && (
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
            <Footer />
        </>
    );
};

export default ProductsBySubSubCategory;