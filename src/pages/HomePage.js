import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid,
  Divider,
  Button
} from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { fetchTrendingMovies } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';
import { useNavigate } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { lastSearch } = useMovieContext();

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchTrendingMovies(1);
        setTrendingMovies(data.results.slice(0, 8));
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingMovies();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Movie Explorer
        </Typography>
        
        <Typography variant="h5" color="text.secondary" paragraph>
          Your one-stop destination for discovering and tracking movies you love
        </Typography>
        
        <Box 
          sx={{ 
            mt: 4, 
            mb: 2, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WhatshotIcon sx={{ mr: 1, color: 'error.main' }} />
            <Typography variant="h5" component="h2">
              Trending Movies
            </Typography>
          </Box>
          
          <Button 
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/trending')}
            color="primary"
          >
            View all
          </Button>
        </Box>
        
        <MovieGrid 
          movies={trendingMovies} 
          loading={loading} 
          error={error}
          hasMore={false}
        />
        
        <Divider sx={{ my: 4 }} />
        
        {lastSearch && (
          <>
            <Box 
              sx={{ 
                mt: 2, 
                mb: 2, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant="h5" component="h2">
                Continue exploring "{lastSearch}"
              </Typography>
              
              <Button 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(`/search?query=${encodeURIComponent(lastSearch)}`)}
                color="primary"
              >
                View results
              </Button>
            </Box>
          </>
        )}
        
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/discover')}
            sx={{ mx: 1 }}
          >
            Discover Movies
          </Button>
          
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/favorites')}
            sx={{ mx: 1 }}
          >
            View Favorites
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
