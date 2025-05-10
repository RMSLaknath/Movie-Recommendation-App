import React, { useRef, useCallback } from 'react';
import { Grid, Box, CircularProgress, Typography } from '@mui/material';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, loading, error, hasMore, loadMore }) => {
  const observer = useRef();
  
  const lastMovieElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Error loading movies: {error.message || 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {movies.map((movie, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            lg={3} 
            key={`${movie.id}-${index}`}
            ref={index === movies.length - 1 ? lastMovieElementRef : null}
          >
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!loading && !hasMore && movies.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1">No more movies to load</Typography>
        </Box>
      )}
      
      {!loading && movies.length === 0 && !error && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">No movies found</Typography>
        </Box>
      )}
    </>
  );
};

export default MovieGrid;
