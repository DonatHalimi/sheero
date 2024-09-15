import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../axiosInstance';
import { SearchBarInput, SearchDropdown } from '../assets/CustomComponents';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const handleInputChange = (event) => {
        const query = event.target.value;
        setSearchTerm(query);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        setDebounceTimeout(
            setTimeout(async () => {
                if (query.length > 2) {
                    try {
                        const response = await axiosInstance.get('/products/search', { params: { query } });
                        setSuggestions(response.data.results);
                    } catch (error) {
                        console.error('Error fetching autocomplete results:', error);
                    }
                } else {
                    setSuggestions([]);
                }
            }, 300)
        );
    };

    const handleSuggestionClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim() !== '') {
            navigate(`/search-results?query=${searchTerm}`);
        }
    };

    return (
        <div className='relative w-full flex justify-center'>
            <form onSubmit={handleSubmit}>
                <SearchBarInput
                    searchTerm={searchTerm}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                />
            </form>
            {suggestions.length > 0 && (
                <SearchDropdown
                    results={suggestions}
                    onClickSuggestion={handleSuggestionClick}
                    searchBarWidth="400px"
                />
            )}
        </div>
    );
};

export default SearchBar;
