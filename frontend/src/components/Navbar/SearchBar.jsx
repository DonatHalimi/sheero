import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBarInput, SearchDropdown } from '../../assets/CustomComponents';
import useAxios from '../../utils/axiosInstance';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const searchContainerRef = useRef(null);

    const navigate = useNavigate();
    const axiosInstance = useAxios();

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
                        const { data } = await axiosInstance.get('/products/search', { params: { query } });
                        setSuggestions(data.results);
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
        setSuggestions([]);
        navigate(`/product/${productId}`);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${searchTerm}`);
            setSuggestions([]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={searchContainerRef} className="relative w-full flex justify-center">
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
                />
            )}
        </div>
    );
};

export default SearchBar;