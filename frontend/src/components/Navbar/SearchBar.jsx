import { ClickAwayListener } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBarInput } from '../../components/custom/MUI';
import { SearchDropdown } from '../../components/custom/Product';
import { fetchSearchResultsService } from '../../services/productService';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const navigate = useNavigate();

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
                        const response = await fetchSearchResultsService(query);
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

    const handleSuggestionClick = (slug) => {
        setSuggestions([]);
        navigate(`/${slug}`);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?query=${searchTerm}`);
            setSuggestions([]);
        }
    };

    return (
        <ClickAwayListener onClickAway={() => setSuggestions([])}>
            <div className="relative w-full flex justify-center">
                <form onSubmit={handleSubmit}>
                    <SearchBarInput
                        searchTerm={searchTerm}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                    />
                </form>
                <>
                    {suggestions.length > 0 && (
                        <SearchDropdown
                            results={suggestions}
                            onClickSuggestion={handleSuggestionClick}
                        />
                    )}
                </>
            </div>
        </ClickAwayListener>
    );
};

export default SearchBar;