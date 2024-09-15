import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAxios from '../axiosInstance';
import { Typography } from '@mui/material';
import ProductItem from './Product/ProductItem';
import Navbar from './Navbar';
import Footer from './Footer';
import { CustomPagination, EmptyState } from '../assets/CustomComponents';
import noResultsImage from '../assets/img/no-results.png';

const itemsPerPage = 10;

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [error, setError] = useState(null);
    const axiosInstance = useAxios();
    const location = useLocation();

    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        const fetchSearchResults = async () => {
            setError(null);
            try {
                const response = await axiosInstance.get('/products/search', { params: { query } });
                setProducts(response.data.results);
                setTotalProducts(response.data.results.length);
            } catch (err) {
                setError('Failed to fetch search results');
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query, axiosInstance]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const pageCount = Math.ceil(totalProducts / itemsPerPage);

    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const renderProductItems = () => (
        getCurrentPageItems().map(product => <ProductItem key={product._id} product={product} />)
    );

    if (error) {
        return (
            <Typography variant="h6" color="error" className="text-center mt-4">
                {error}
            </Typography>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 mb-16 bg-gray-50">
                {totalProducts > 0 ? (
                    <>
                        <div className="sticky top-0 z-10 pb-4 bg-gray-50">
                            <Typography variant="h5" gutterBottom>
                                Search Results for "{query}"
                            </Typography>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {renderProductItems()}
                        </div>
                        <CustomPagination
                            count={pageCount}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptyState
                        imageSrc={noResultsImage}
                        message="No results found for"
                        dynamicValue={`"${query}"`}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

export default SearchResults;
