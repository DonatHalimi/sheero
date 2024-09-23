import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomPagination, EmptyState, GoBackButton } from '../../assets/CustomComponents';
import noProducts from '../../assets/img/no-products.png';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import ProductItem from '../../components/Product/ProductItem';
import { Skeleton } from '@mui/material';

const ProductsBySubcategory = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [subcategoryName, setSubcategoryName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchProductsAndSubcategory = async () => {
            setLoading(true);
            try {
                const subcategoryResponse = await axios.get(`http://localhost:5000/api/subcategories/get/${id}`);
                setSubcategoryName(subcategoryResponse.data.name);

                const productsResponse = await axios.get(`http://localhost:5000/api/products/get-by-subcategory/${id}`);
                setProducts(productsResponse.data.products);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching products or subcategory:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndSubcategory();
    }, [id]);

    const pageCount = Math.ceil(products.length / itemsPerPage);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const renderProductItems = () => (
        loading
            ? Array.from({ length: itemsPerPage }, (_, index) => <ProductItem key={index} loading={true} />)
            : getCurrentPageItems().map(product => <ProductItem key={product._id} product={product} loading={false} />)
    );

    return (
        <>
            <Navbar />

            <div className="container mx-auto px-4 py-8 mb-16 bg-gray-50">
                {products.length > 0 && (
                    <GoBackButton />
                )}

                <div className="sticky top-0 z-10 pb-4 bg-gray-50">
                    {loading ? (
                        <Skeleton variant="text" animation="wave" width={250} height={20} />
                    ) : products.length > 0 ? (
                        <h1 className="text-2xl font-semibold" id='product-container'>
                            Products in {subcategoryName}
                        </h1>
                    ) : (
                        <EmptyState
                            imageSrc={noProducts}
                            message="No products found for"
                            dynamicValue={subcategoryName}
                            containerClass="p-8 mt-4 mx-14 md:mx-16 lg:mx-72"
                            imageClass="w-32 h-32"
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {renderProductItems()}
                </div>

                {!loading && products.length > 0 && (
                    <CustomPagination
                        count={pageCount}
                        page={currentPage}
                        onChange={handlePageChange}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default ProductsBySubcategory;