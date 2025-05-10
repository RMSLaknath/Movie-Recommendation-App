import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid,
  Paper,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../api/tmdb';
import { useMovieContext } from '../context/MovieContext';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useMovieContext();
  const favorite = movie ? isFavorite(movie.id) : false;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTrailerKey = () => {
    if (!movie || !movie.videos || !movie.videos.results) return null;
    
    const trailer = movie.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    return trailer ? trailer.key : null;
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ my: 5 }}>
          <Typography variant="h5" color="error">
            Error loading movie: {error.message || 'Unknown error'}
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Box sx={{ my: 5 }}>
          <Typography variant="h5">
            Movie not found
          </Typography>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  const trailerKey = getTrailerKey();

  return (
    <Container maxWidth="xl">
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ my: 2 }}
      >
        Go Back
      </Button>

      <Paper 
        elevation={3}
        sx={{ 
          backgroundImage: movie.backdrop_path 
            ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: movie.backdrop_path ? 'white' : 'inherit',
          p: 4
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box 
              component="img"
              src={movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/placeholder-poster.png'
              }
              alt={movie.title}
              sx={{ 
                width: '100%', 
                borderRadius: 1,
                boxShadow: 3
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom>
              {movie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating 
                value={movie.vote_average / 2} 
                precision={0.5} 
                readOnly
              />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              {movie.genres.map((genre) => (
                <Chip 
                  key={genre.id} 
                  label={genre.name} 
                  sx={{ mr: 1, mb: 1 }}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              {movie.release_date?.split('-')[0]} • {formatRuntime(movie.runtime)}
            </Typography>
            
            <Typography variant="h5" gutterBottom>
              Overview
            </Typography>
            
            <Typography variant="body1" paragraph>
              {movie.overview}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant={favorite ? "contained" : "outlined"}
                startIcon={favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleFavoriteClick}
                color="secondary"
              >
                {favorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {trailerKey && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Trailer
          </Typography>
          <Paper elevation={2} sx={{ overflow: 'hidden', pt: 'calc(9/16 * 100%)', position: 'relative' }}>
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            ></iframe>
          </Paper>
        </Box>
      )}
      
      {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 && (
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Top Cast
          </Typography>
          <Grid container spacing={2}>
            {movie.credits.cast.slice(0, 6).map((person) => (
              <Grid item xs={12} sm={6} md={4} key={person.id}>
                <List>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar 
                        src={person.profile_path 
                          ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                          : null
                        }
                        alt={person.name}
                      />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={person.name} 
                      secondary={`as ${person.character}`} 
                    />
                  </ListItem>
                </List>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default MovieDetailsPage;
