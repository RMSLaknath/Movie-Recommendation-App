import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
  Paper,
  Chip,
  Button
} from '@mui/material';
import { getMoviesByGenre, getGenres } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';

const DiscoverPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [yearRange, setYearRange] = useState([2000, new Date().getFullYear()]);
  const [ratingRange, setRatingRange] = useState([0, 10]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleYearRangeChange = (event, newValue) => {
    setYearRange(newValue);
  };

  const handleRatingRangeChange = (event, newValue) => {
    setRatingRange(newValue);
  };

  const handleApplyFilters = () => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    loadMovies(1, true);
  };

  const loadMovies = async (pageToLoad, reset = false) => {
    if (!selectedGenre) return;
    
    try {
      setLoading(true);
      // In a real app, you would include all filter parameters
      // For this demo, we're just using genre
      const data = await getMoviesByGenre(selectedGenre, pageToLoad);
      
      // In a real app, you would filter by year and rating on the client side
      // or ideally have API parameters for these filters
      let filteredResults = data.results.filter(movie => {
        const movieYear = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : 0;
        return (
          movieYear >= yearRange[0] && 
          movieYear <= yearRange[1] &&
          movie.vote_average >= ratingRange[0] &&
          movie.vote_average <= ratingRange[1]
        );
      });
      
      if (reset) {
        setMovies(filteredResults);
      } else {
        setMovies(prev => [...prev, ...filteredResults]);
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

  const currentYear = new Date().getFullYear();

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Discover Movies
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="genre-select-label">Genre</InputLabel>
                <Select
                  labelId="genre-select-label"
                  id="genre-select"
                  value={selectedGenre}
                  label="Genre"
                  onChange={handleGenreChange}
                >
                  {genres.map(genre => (
                    <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>
                Release Year Range
              </Typography>
              <Slider
                value={yearRange}
                onChange={handleYearRangeChange}
                valueLabelDisplay="auto"
                min={1900}
                max={currentYear}
                step={1}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Chip label={yearRange[0]} size="small" />
                <Chip label={yearRange[1]} size="small" />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>
                Rating Range
              </Typography>
              <Slider
                value={ratingRange}
                onChange={handleRatingRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                step={0.5}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Chip label={`${ratingRange[0]}/10`} size="small" />
                <Chip label={`${ratingRange[1]}/10`} size="small" />
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleApplyFilters}
              disabled={!selectedGenre}
            >
              Apply Filters
            </Button>
          </Box>
        </Paper>
        
        {selectedGenre ? (
          <MovieGrid 
            movies={movies} 
            loading={loading} 
            error={error}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        ) : (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Please select a genre to discover movies
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DiscoverPage;
