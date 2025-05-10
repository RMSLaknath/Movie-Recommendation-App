import React, { createContext, useContext, useState, useEffect } from 'react';

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [lastSearch, setLastSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    
    const storedLastSearch = localStorage.getItem('lastSearch');
    if (storedLastSearch) {
      setLastSearch(storedLastSearch);
    }
  }, []);
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  // Save last search to localStorage
  useEffect(() => {
    if (lastSearch) {
      localStorage.setItem('lastSearch', lastSearch);
    }
  }, [lastSearch]);
  
  const addFavorite = (movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };
  
  const removeFavorite = (movieId) => {
    setFavorites(favorites.filter(movie => movie.id !== movieId));
  };
  
  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };
  
  const updateLastSearch = (query) => {
    setLastSearch(query);
  };
  
  const updateSearchResults = (results) => {
    setSearchResults(results);
  };
  
  const value = {
    favorites,
    lastSearch,
    searchResults,
    addFavorite,
    removeFavorite,
    isFavorite,
    updateLastSearch,
    updateSearchResults
  };
  
  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
