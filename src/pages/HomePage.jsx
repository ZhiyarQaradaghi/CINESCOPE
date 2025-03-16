import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Dialog,
  DialogContent,
  useMediaQuery,
  useTheme,
  Container,
  Paper,
  alpha,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchBar from "../components/common/SearchBar";
import Loader from "../components/common/Loader";
import MovieGrid from "../components/movie/MovieGrid";
import Pagination from "../components/common/Pagination";
import Filters from "../components/movie/Filters";
import MovieDetail from "../components/movie/MovieDetail";
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  searchMovies,
  fetchMovieDetails,
  fetchGenres,
} from "../services/movieApi";
import WatchPage from "./WatchPage";

const pageTypeToTitle = {
  home: "Discover Movies",
  popular: "Popular Movies",
  top_rated: "Top Rated Movies",
  upcoming: "Upcoming Movies",
};

const pageTypeToDescription = {
  home: "Explore thousands of movies, from blockbusters to indie gems",
  popular: "Check out what everyone's watching right now",
  top_rated: "The highest-rated films of all time",
  upcoming: "Get a sneak peek at movies coming soon",
};

const HomePage = ({ pageType = "home" }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [movieDetails, setMovieDetails] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [watchingMovieId, setWatchingMovieId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("popular");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery("");
    setSelectedGenre("");
    setSelectedYear("");
  }, [pageType]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const genreData = await fetchGenres();
        setGenres(genreData || []);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        setGenres([]);
      }
    };

    getGenres();
  }, []);
  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      try {
        let data;
        if (searchQuery && searchQuery.trim() !== "") {
          data = await searchMovies(searchQuery, currentPage);
        } else {
          const params = {
            page: currentPage,
            ...(selectedGenre ? { with_genres: selectedGenre } : {}),
            ...(selectedYear ? { primary_release_year: selectedYear } : {}),
          };

          switch (selectedCategory) {
            case "popular":
              data = await fetchPopularMovies(currentPage, params);
              break;
            case "top_rated":
              data = await fetchTopRatedMovies(currentPage, params);
              break;
            case "upcoming":
              data = await fetchUpcomingMovies(currentPage, params);
              break;
            default:
              data = await fetchPopularMovies(currentPage, params);
          }
        }

        if (!data || !data.results) {
          console.error("Invalid data format received from API");
          setMovies([]);
          setTotalPages(0);
          return;
        }

        setMovies(data.results);
        setTotalPages(data.total_pages || 0);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        setMovies([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, [searchQuery, currentPage, selectedGenre, selectedYear, selectedCategory]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSelectedGenre("");
    setSelectedYear("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

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

  const handleBackFromWatch = () => {
    setWatchingMovieId(null);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  const pageTitle = pageTypeToTitle[pageType] || "Discover Movies";
  const pageDescription =
    pageTypeToDescription[pageType] || "Explore thousands of movies";

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
      {watchingMovieId ? (
        <WatchPage movieId={watchingMovieId} onBack={handleBackFromWatch} />
      ) : (
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
              {pageTitle}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
            >
              {pageDescription}
            </Typography>

            <Box sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
              <SearchBar onSearch={handleSearch} />
            </Box>

            <Paper
              elevation={3}
              sx={{
                p: 2,
                mb: 4,
                background: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: "blur(10px)",
                borderRadius: 2,
              }}
            >
              <Filters
                genres={genres || []}
                selectedGenre={selectedGenre}
                onGenreChange={handleGenreChange}
                yearRange={selectedYear}
                onYearChange={setSelectedYear}
                category={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </Paper>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <Loader />
            </Box>
          ) : movies && movies.length > 0 ? (
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
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : pageType === "home"
                  ? "Popular Movies"
                  : pageTitle}
              </Typography>
              <MovieGrid
                movies={movies}
                onMovieClick={handleMovieClick}
                onWatchClick={handleWatchClick}
              />
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </Box>
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
              <Typography variant="h6" gutterBottom>
                No movies found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filters to find what you're looking
                for.
              </Typography>
            </Paper>
          )}
        </Container>
      )}

      <Dialog
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
        open={dialogOpen}
        onClose={handleCloseDialog}
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

export default HomePage;
