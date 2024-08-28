import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomPagination } from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import ProductItem from '../../components/ProductItem';
import Slideshow from '../../components/Slideshow';

const ProductsBySubcategory = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [subcategoryName, setSubcategoryName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchProductsAndCategory = async () => {
            try {
                const subcategoryResponse = await axios.get(`http://localhost:5000/api/subcategories/get/${id}`);
                setSubcategoryName(subcategoryResponse.data.name);

                const productsResponse = await axios.get(`http://localhost:5000/api/products/get-by-subcategory/${id}`);
                setProducts(productsResponse.data.products);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching products or subcategory:', error);
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
            <Slideshow />
            <div className="container mx-auto px-4 py-8 mb-16 bg-gray-50">
                <div className="sticky top-0 z-10 pb-4 bg-gray-50">
                    {products.length > 0 ? (
                        <h1 className="text-2xl font-semibold" id='product-container'>Products in {subcategoryName}</h1>
                    ) : (
                        <h1 className="text-2xl font-semibold text-center" id='product-container'>No products found in {subcategoryName}</h1>
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

export default ProductsBySubcategory;