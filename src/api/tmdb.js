import axios from 'axios';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const baseURL = process.env.REACT_APP_TMDB_API_URL;

if (!apiKey || !baseURL) {
  throw new Error(
    'Missing TMDb API key or base URL. Please check your .env file and restart the dev server.'
  );
}

const api = axios.create({
  baseURL: baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL, // Ensure no trailing slash
});

export const fetchTrendingMovies = async (page = 1, timeWindow = 'week') => {
  try {
    const params = {
      api_key: apiKey,
      language: 'en-US',
      page,
    };
    const endpoint = `/trending/movie/${timeWindow}`;
    const response = await api.get(endpoint, { params });
    console.log('Trending movies data:', response.data); // Debug log
    return response.data;
  } catch (error) {
    // Print more details for debugging
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error fetching trending movies:', error.message);
    }
    throw error;
  }
};

// Add missing API functions below

export const getGenres = async () => {
  try {
    const params = {
      api_key: apiKey,
      language: 'en-US',
    };
    const response = await api.get('/genre/movie/list', { params });
    console.log('Genres data:', response.data); // Debug log
    return response.data.genres;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error fetching genres:', error.message);
    }
    throw error;
  }
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const params = {
      api_key: apiKey,
      language: 'en-US',
      with_genres: genreId,
      page,
    };
    const response = await api.get('/discover/movie', { params });
    console.log('Movies by genre data:', response.data); // Debug log
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error fetching movies by genre:', error.message);
    }
    throw error;
  }
};

export const getMovieDetails = async (id) => {
  try {
    const params = {
      api_key: apiKey,
      language: 'en-US',
      append_to_response: 'videos,credits',
    };
    const response = await api.get(`/movie/${id}`, { params });
    console.log('Movie details data:', response.data); // Debug log
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error fetching movie details:', error.message);
    }
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const params = {
      api_key: apiKey,
      language: 'en-US',
      query,
      page,
      include_adult: false,
    };
    const response = await api.get('/search/movie', { params });
    console.log('Search movies data:', response.data); // Debug log
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Error searching movies:', error.message);
    }
    throw error;
  }
};