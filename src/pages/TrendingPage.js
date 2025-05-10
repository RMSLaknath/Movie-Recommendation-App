import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { fetchTrendingMovies } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';

const TrendingPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [timeWindow, setTimeWindow] = useState('week');

  useEffect(() => {
    loadMovies(1, true);
  }, [timeWindow]);

  const loadMovies = async (pageToLoad, reset = false) => {
    try {
      setLoading(true);
      const data = await fetchTrendingMovies(pageToLoad, timeWindow);
      
      if (reset) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      
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

  const handleTimeWindowChange = (event) => {
    setTimeWindow(event.target.value);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Trending Movies
          </Typography>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="time-window-select-label">Time Window</InputLabel>
            <Select
              labelId="time-window-select-label"
              id="time-window-select"
              value={timeWindow}
              label="Time Window"
              onChange={handleTimeWindowChange}
            >
              <MenuItem value="day">Today</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <MovieGrid 
          movies={movies} 
          loading={loading} 
          error={error}
          hasMore={hasMore}
          loadMore={loadMore}
        />
      </Box>
    </Container>
  );
};

export default TrendingPage;
