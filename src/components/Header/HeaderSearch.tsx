import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { SearchSuggestions } from './SearchSuggestions';
import { SearchIcon } from '../ui/icons/SearchIcon';
import { useProductSuggestions } from '@/hooks/useProductSuggestions';
import { useDebounce } from '@/hooks/useDebounce';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';
import { useAppDispatch } from '@/store/hooks';
import { addToSearchHistory } from '@/store/searchHistorySlice';
import { SEARCH_PLACEHOLDERS } from '@/data/searchPlaceholders';
import styles from './HeaderSearch.module.css';

const HeaderSearch = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('name') || '';

  const [searchValue, setSearchValue] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const placeholder = useTypingAnimation({ strings: SEARCH_PLACEHOLDERS });

  const suggestionsQuery = useDebounce(searchValue, 300);

  const { data: suggestions = [], isLoading: isSuggestionsLoading } =
    useProductSuggestions(suggestionsQuery);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const urlQuery = searchParams.get('name') || '';
    if (urlQuery !== searchValue) {
      setSearchValue(urlQuery);
    }
  }, [searchParams, searchValue]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (query: string) => {
    if (query) {
      dispatch(addToSearchHistory(query));
      
      // Create fresh params to clear all existing filters/category context
      const newParams = new URLSearchParams();
      newParams.set('name', query);
      
      // Always navigate to the main products page for a global search
      navigate(`/products?${newParams.toString()}`, { replace: true });
    } else {
      // If clearing search, remove 'name' filter but keep other filters if they exist
      const params = new URLSearchParams(searchParams);
      params.delete('name');
      params.delete('page');
      
      const searchStr = params.toString();
      const newPath = `${location.pathname}${searchStr ? `?${searchStr}` : ''}`;
      navigate(newPath, { replace: true });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setIsSuggestionsVisible(true);
  };

  const handleClear = () => {
    setSearchValue('');
    setIsSuggestionsVisible(false);
    if (
      location.pathname === '/products' ||
      location.pathname.startsWith('/products/')
    ) {
      performSearch('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuggestionsVisible(false);
    performSearch(searchValue);
  };

  const handleSuggestionClick = () => {
    setIsSuggestionsVisible(false);
  };

  const handleViewAllClick = () => {
    setIsSuggestionsVisible(false);
    performSearch(searchValue);
  };

  return (
    <form className={styles.searchBox} onSubmit={handleSubmit} ref={formRef}>
      <div className={styles.inputWrapper}>
        <input
          type='text'
          className={styles.input}
          placeholder={isFocused ? '' : placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            setIsSuggestionsVisible(true);
          }}
          onBlur={() => setIsFocused(false)}
        />
        <div className={styles.searchBoxIcon}>
          <SearchIcon />
        </div>
        {searchValue && (
          <button
            type='button'
            className={styles.clearButton}
            onClick={handleClear}
            aria-label='Clear search'
          >
            ✕
          </button>
        )}
      </div>

      <SearchSuggestions
        suggestions={suggestions}
        isLoading={isSuggestionsLoading}
        isVisible={isSuggestionsVisible}
        onItemClick={handleSuggestionClick}
        onViewAllClick={handleViewAllClick}
        searchValue={searchValue}
        onSearch={performSearch}
      />
    </form>
  );
};

export { HeaderSearch };
