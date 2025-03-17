import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  useTheme,
  Dialog,
  DialogContent,
  useMediaQuery,
  Tab,
  Tabs,
} from "@mui/material";
import Loader from "../components/common/Loader";
import MovieSlider from "../components/movie/MovieSlider";
import MovieDetail from "../components/movie/MovieDetail";
import {
  fetchMoviesByGenre,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchMovieDetails,
  fetchGenres,
} from "../services/movieApi";
import SearchBar from "../components/common/SearchBar";
import WatchPage from "./WatchPage";
import { ServerProvider } from "../contexts/ServerContext";

const ExplorePage = () => {
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});
  const [trendingMovies, setTrendingMovies] = useState({
    day: [],
    week: [],
  });
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [movieDetails, setMovieDetails] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [timeWindow, setTimeWindow] = useState("week");
  const [watchingMovieId, setWatchingMovieId] = useState(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const genreData = await fetchGenres();
        setGenres(genreData || []);
        const dayTrending = await fetchTrendingMovies("day");
        const weekTrending = await fetchTrendingMovies("week");

        setTrendingMovies({
          day: dayTrending?.results || [],
          week: weekTrending?.results || [],
        });

        const popular = await fetchPopularMovies(1);
        const topRated = await fetchTopRatedMovies(1);

        setPopularMovies(popular?.results || []);
        setTopRatedMovies(topRated?.results || []);

        const mainGenres = genreData?.slice(0, 6) || [];
        const genreMoviesData = {};

        await Promise.all(
          mainGenres.map(async (genre) => {
            const movies = await fetchMoviesByGenre(genre.id);
            genreMoviesData[genre.id] = movies?.results || [];
          })
        );

        setGenreMovies(genreMoviesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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
    setWatchingMovieId(movieId);
    setDialogOpen(false);
    setMovieDetails(null);
    window.scrollTo(0, 0);
  };

  const handleTimeWindowChange = (event, newValue) => {
    setTimeWindow(newValue);
  };

  const handleSearch = (query) => {
    if (query) {
      window.location.href = `/?search=${encodeURIComponent(query)}`;
    }
  };

  const handleBackFromWatch = () => {
    setWatchingMovieId(null);
  };

  if (watchingMovieId) {
    return (
      <ServerProvider>
        <WatchPage movieId={watchingMovieId} onBack={handleBackFromWatch} />
      </ServerProvider>
    );
  }

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
            Explore Movies
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
          >
            Discover new movies across different genres and trending categories
          </Typography>

          <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
            <SearchBar onSearch={handleSearch} />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <Loader />
          </Box>
        ) : (
          <Box>
            {/* Trending Section with Tabs */}
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    pl: 2,
                    mr: 3,
                  }}
                >
                  Trending Movies
                </Typography>
                <Tabs
                  value={timeWindow}
                  onChange={handleTimeWindowChange}
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{
                    "& .MuiTab-root": {
                      minWidth: "auto",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 500,
                    },
                  }}
                >
                  <Tab value="day" label="Today" />
                  <Tab value="week" label="This Week" />
                </Tabs>
              </Box>
              <MovieSlider
                movies={trendingMovies[timeWindow]}
                onMovieClick={handleMovieClick}
                onWatchClick={handleWatchClick}
              />
            </Box>

            {/* Popular Movies Section */}
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  pl: 2,
                }}
              >
                Popular Movies
              </Typography>
              <MovieSlider
                movies={popularMovies}
                onMovieClick={handleMovieClick}
                onWatchClick={handleWatchClick}
              />
            </Box>

            {/* Top Rated Movies Section */}
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  pl: 2,
                }}
              >
                Top Rated Movies
              </Typography>
              <MovieSlider
                movies={topRatedMovies}
                onMovieClick={handleMovieClick}
                onWatchClick={handleWatchClick}
              />
            </Box>

            {/* Genre-based Sections */}
            {genres.slice(0, 6).map((genre) => (
              <Box key={genre.id} sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 2,
                    fontWeight: 600,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    pl: 2,
                  }}
                >
                  {genre.name} Movies
                </Typography>
                <MovieSlider
                  movies={genreMovies[genre.id] || []}
                  onMovieClick={handleMovieClick}
                  onWatchClick={handleWatchClick}
                />
              </Box>
            ))}
          </Box>
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

export default ExplorePage;
