import React, { useState, useEffect } from 'react';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useMovieContext } from '../context/MovieContext';
import { searchMovies } from '../api/tmdb';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const { updateLastSearch, lastSearch } = useMovieContext();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(lastSearch || '');
  }, [lastSearch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (query.trim()) {
      updateLastSearch(query);
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    updateLastSearch('');
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: { xs: '100%', sm: '400px' },
        borderRadius: '20px',
      }}
      elevation={3}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        inputProps={{ 'aria-label': 'search movies' }}
      />
      {query && (
        <IconButton type="button" aria-label="clear" onClick={handleClear}>
          <ClearIcon />
        </IconButton>
      )}
      <IconButton type="submit" aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
