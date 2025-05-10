import React from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Button
} from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import { useMovieContext } from '../context/MovieContext';
import MovieIcon from '@mui/icons-material/Movie';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const { favorites } = useMovieContext();
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Favorite Movies
        </Typography>
        
        {favorites.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mt: 8 
          }}>
            <MovieIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You haven't added any favorite movies yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph align="center">
              Explore and add movies to your favorites to see them here
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/trending')}
              sx={{ mt: 2 }}
            >
              Explore Trending Movies
            </Button>
          </Box>
        ) : (
          <MovieGrid 
            movies={favorites} 
            loading={false} 
            error={null}
            hasMore={false}
          />
        )}
      </Box>
    </Container>
  );
};

export default FavoritesPage;
