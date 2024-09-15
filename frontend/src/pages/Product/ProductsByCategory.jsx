import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomPagination, GoBackButton, EmptyState } from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import ProductItem from '../../components/Product/ProductItem';
import noProducts from '../../assets/img/no-products.png';

const ProductsByCategory = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchProductsAndCategory = async () => {
            try {
                const categoryResponse = await axios.get(`http://localhost:5000/api/categories/get/${id}`);
                setCategoryName(categoryResponse.data.name);

                const productsResponse = await axios.get(`http://localhost:5000/api/products/get-by-category/${id}`);
                setProducts(productsResponse.data.products);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching products or category:', error);
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

            <div className="container mx-auto px-4 py-8 mb-16 bg-gray-50">
                {products.length > 0 && (
                    <GoBackButton />
                )}

                <div className="sticky top-0 z-10 pb-4 bg-gray-50">
                    {products.length > 0 ? (
                        <h1 className="text-2xl font-semibold" id='product-container'>Products in {categoryName}</h1>
                    ) : (
                        <>
<EmptyState 
    imageSrc={noProducts}
    message="No products found for"
    dynamicValue={categoryName}
    containerClass="p-8 mt-4 mx-14 md:mx-16 lg:mx-72"  // Custom container class
    imageClass="w-32 h-32"  // Smaller image
/>
                        </>
                    )}
                </div>
                {products.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {getCurrentPageItems().map(product => (
                            <ProductItem key={product._id} product={product} />
                        ))}
                    </div>
                )}

                <CustomPagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
            <Footer />
        </>
    );
};

export default ProductsByCategory;