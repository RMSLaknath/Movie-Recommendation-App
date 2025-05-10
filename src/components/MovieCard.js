import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  CardActions,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { useMovieContext } from '../context/MovieContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useMovieContext();
  const favorite = isFavorite(movie.id);

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.03)',
          cursor: 'pointer'
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={handleCardClick}
      elevation={3}
    >
      <CardMedia
        component="img"
        height="400"
        image={movie.poster_path 
          ? `${process.env.REACT_APP_TMDB_IMG_URL}${movie.poster_path}`
          : '/placeholder-poster.png'
        }
        alt={movie.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.release_date?.split('-')[0] || 'Unknown Year'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <StarIcon sx={{ color: '#FFD700', mr: 0.5 }} fontSize="small" />
          <Typography variant="body2">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </Typography>
        </Box>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton 
          aria-label={favorite ? "remove from favorites" : "add to favorites"}
          onClick={handleFavoriteClick}
          color={favorite ? "secondary" : "default"}
        >
          {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
