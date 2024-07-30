import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import ProductItem from './ProductItem';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/get');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const pageCount = Math.ceil(products.length / itemsPerPage);

    const getCurrentPageProducts = () => {
        const startIndex = currentPage * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;

    return (
        <div className="container mx-auto px-4 py-8 mb-16">
            <div className="sticky top-0 bg-white z-10 pb-4">
                <h1 className="text-2xl font-semibold mb-4">Products</h1>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {getCurrentPageProducts().map(product => (
                    <ProductItem key={product._id} product={product} />
                ))}
            </div>
            <div className="flex justify-center mt-8">
                <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={1}
                    onPageChange={handlePageClick}
                    containerClassName="inline-flex -space-x-px text-sm"
                    activeClassName="text-stone-600 bg-stone-200 border-blue-500"
                    previousLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${isPreviousDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                    nextLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${isNextDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                    disabledClassName="text-gray-50 cursor-not-allowed"
                    activeLinkClassName="text-stone-600 bg-stone-200 border-blue-500"
                    previousLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 rounded-s-lg hover:text-gray-700">Previous</span>}
                    nextLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 rounded-e-lg hover:text-gray-700">Next</span>}
                    breakLabel={<span className="flex items-center justify-center px-4 h-10 text-gray-500 bg-white border border-gray-300">...</span>}
                    pageClassName="flex items-center justify-center px-1 h-10 text-gray-500 border border-gray-300 cursor-pointer"
                    pageLinkClassName="flex items-center justify-center px-3 h-10 text-gray-500 cursor-pointer"
                />
            </div>
        </div>
    );
};

export default ProductList;