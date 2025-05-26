import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import noResultsImage from '../../assets/img/empty/search-results.png';
import { CustomPagination, GoBackButton, NotFound } from '../../components/custom/MUI';
import { calculatePageCount, getPaginatedItems, handlePageChange } from '../../components/custom/utils';
import Navbar from '../../components/Navbar/Navbar';
import ProductItem from '../../components/Product/Items/ProductItem';
import Footer from '../../components/Utils/Footer';
import { fetchSearchResultsService } from '../../services/productService';

const itemsPerPage = 40;

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        const fetchSearchResults = async () => {
            setError(null);
            try {
                const response = await fetchSearchResultsService(query);
                setProducts(response.data.results);
                setTotalProducts(response.data.results.length);
            } catch (err) {
                setError('Failed to fetch search results');
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const handleProductClick = (slug) => {
        if (slug) {
            navigate(`/${slug}`);
        }
    };

    const renderProductItems = () => (
        currentPageItems.map(product => (
            <ProductItem
                key={product._id}
                product={product}
                onClick={() => handleProductClick(product.slug)}
            />
        ))
    );

    if (error) {
        return (
            <Typography variant="h6" color="error" className="text-center mt-4">
                {error}
            </Typography>
        );
    }

    const renderHeader = () => (
        <>
            <GoBackButton />
            <Typography variant="h5" className="mb-1">
                {totalProducts} {totalProducts === 1 ? 'product' : 'products'} found for "{query}"
            </Typography>
        </>
    );

    const pageCount = calculatePageCount(products, itemsPerPage);
    const currentPageItems = getPaginatedItems(products, currentPage, itemsPerPage);

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 mb-16 bg-gray-50">
                {totalProducts > 0 ? (
                    <>
                        <div className="sticky top-0 z-10 pb-4 bg-gray-50">
                            {renderHeader()}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {renderProductItems()}
                        </div>
                        <CustomPagination
                            count={pageCount}
                            page={currentPage}
                            onChange={handlePageChange(setCurrentPage)}
                            sx={{ position: 'relative', bottom: '-2px', }}
                        />
                    </>
                ) : (
                    <NotFound
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