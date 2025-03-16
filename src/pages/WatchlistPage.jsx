import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Paper,
  Button,
  alpha,
  useTheme,
} from "@mui/material";
import Loader from "../components/common/Loader";
import MovieCard from "../components/movie/MovieCard";
import MovieDetail from "../components/movie/MovieDetail";
import { fetchMovieDetails } from "../services/movieApi";
import { useAuth } from "../contexts/AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const WatchlistPage = () => {
  const [loading, setLoading] = useState(true);
  const [movieDetails, setMovieDetails] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, favorites } = useAuth();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // this is to simulate the loading of the page
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMovieClick = async (movieId) => {
    try {
      const details = await fetchMovieDetails(movieId);
      setMovieDetails(details);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setMovieDetails(null);
  };

  const handleWatchClick = (movieId) => {
    window.location.href = `/?watch=${movieId}`;
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(to bottom, #0f0f1e 0%, #1a1a2e 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(45deg, #646cff, #ff64c8)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
            }}
          >
            My Watchlist
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
          >
            Keep track of movies you want to watch later
          </Typography>
        </Box>

        {!user ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              background: alpha(theme.palette.background.paper, 0.7),
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Please log in to view your watchlist
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => (window.location.href = "/login")}
            >
              Log In
            </Button>
          </Paper>
        ) : loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <Loader />
          </Box>
        ) : favorites && favorites.length > 0 ? (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 600,
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                pl: 2,
              }}
            >
              Your Saved Movies
            </Typography>
            <Grid container spacing={3}>
              {favorites.map((movie) => (
                <Grid item key={movie.id} xs={6} sm={4} md={3} lg={2.4}>
                  <MovieCard
                    movie={movie}
                    onClick={handleMovieClick}
                    onWatchClick={handleWatchClick}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              background: alpha(theme.palette.background.paper, 0.7),
              borderRadius: 2,
            }}
          >
            <BookmarkIcon
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              Your watchlist is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start adding movies to your watchlist to keep track of what you
              want to watch.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/")}
            >
              Browse Movies
            </Button>
          </Paper>
        )}
      </Container>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent sx={{ p: 0 }}>
          <MovieDetail
            movie={movieDetails}
            onClose={handleCloseDialog}
            onWatchClick={handleWatchClick}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default WatchlistPage;
