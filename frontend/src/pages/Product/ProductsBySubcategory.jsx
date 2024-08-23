import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useParams } from 'react-router-dom';
import { ProductPagination } from '../../components/Dashboard/Pagination';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import ProductItem from '../../components/ProductItem';
import Slideshow from '../../components/Slideshow';

const ProductsBySubcategory = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [subcategoryName, setSubcategoryName] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        setProducts([]);
        setSubcategoryName('');
        setCurrentPage(0);

        const fetchProductsAndCategory = async () => {
            try {
                const subcategoryResponse = await axios.get(`http://localhost:5000/api/subcategories/get/${id}`);
                setSubcategoryName(subcategoryResponse.data.name);

                const productsResponse = await axios.get(`http://localhost:5000/api/products/get-by-subcategory/${id}`);
                setProducts(productsResponse.data.products);
            } catch (error) {
                console.error('Error fetching products or category:', error);
            }
        };

        fetchProductsAndCategory();
    }, [id]);

    const pageCount = Math.ceil(products.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = pageCount && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
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
                {products.length > 0 && paginationEnabled && (
                    <div className="flex justify-center mt-8">
                        <ReactPaginate
                            pageCount={pageCount}
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={1}
                            onPageChange={({ selected }) => setCurrentPage(selected)}
                            containerClassName={ProductPagination.container}
                            activeClassName={ProductPagination.active}
                            pageClassName={ProductPagination.page}
                            pageLinkClassName={ProductPagination.link}
                            disabledClassName={ProductPagination.disabled}
                            activeLinkClassName={ProductPagination.activeLink}
                            previousLabel="Previous"
                            nextLabel="Next"
                            breakLabel="..."
                            breakClassName={ProductPagination.break}
                            previousClassName={`${ProductPagination.nav} ${currentPage === 0 ? ProductPagination.disabled : ''}`}
                            nextClassName={`${ProductPagination.nav} ${currentPage >= pageCount - 1 ? ProductPagination.disabled : ''}`}
                        />
                    </div>
                )}
            </div >
            <Footer />
        </>
    );
};

export default ProductsBySubcategory;