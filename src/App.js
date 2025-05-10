import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { MovieProvider } from './context/MovieContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TrendingPage from './pages/TrendingPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FavoritesPage from './pages/FavoritesPage';
import DiscoverPage from './pages/DiscoverPage';
import Login from './components/Login';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MovieProvider>
          <Router>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <Box sx={{ flexGrow: 1, py: 2 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/movie/:id" element={<MovieDetailsPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/discover" element={<DiscoverPage />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Box>
              <Box
                component="footer"
                sx={{
                  py: 3,
                  px: 2,
                  mt: 'auto',
                  bgcolor: 'background.paper'
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  Movie Explorer App © {new Date().getFullYear()} - Powered by TMDb API
                </Box>
              </Box>
            </Box>
          </Router>
        </MovieProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
