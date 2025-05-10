import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';
import { useMovieContext } from '../context/MovieContext';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { updateLastSearch, updateSearchResults } = useMovieContext();
  
  useEffect(() => {
    if (query) {
      updateLastSearch(query);
      setMovies([]);
      setPage(1);
      setHasMore(true);
      loadMovies(1, true);
    }
  }, [query, updateLastSearch]);
  
  const loadMovies = async (pageToLoad, reset = false) => {
    if (!query) return;
    
    try {
      setLoading(true);
      const data = await searchMovies(query, pageToLoad);
      
      if (reset) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      
      updateSearchResults(data.results);
      setHasMore(data.page < data.total_pages);
      setPage(data.page);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  const loadMore = () => {
    if (!loading && hasMore) {
      loadMovies(page + 1);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Results for "{query}"
        </Typography>
        
        {!query ? (
          <Typography variant="body1">
            Please enter a search term to find movies.
          </Typography>
        ) : (
          <MovieGrid 
            movies={movies} 
            loading={loading} 
            error={error}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        )}
      </Box>
    </Container>
  );
};

export default SearchResultsPage;
