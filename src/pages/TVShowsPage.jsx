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
  Chip,
} from "@mui/material";
import SearchBar from "../components/common/SearchBar";
import Loader from "../components/common/Loader";
import MovieGrid from "../components/movie/MovieGrid";
import Pagination from "../components/common/Pagination";
import Filters from "../components/movie/Filters";
import MovieDetail from "../components/movie/MovieDetail";
import {
  fetchPopularTVShows,
  fetchTopRatedTVShows,
  fetchOnAirTVShows,
  searchTVShows,
  fetchTVShowDetails,
  fetchGenres,
} from "../services/tvApi";
import WatchTVShowPage from "./WatchTVShowPage";
import { ServerProvider } from "../contexts/ServerContext";

const pageTypeToTitle = {
  home: "Discover TV Shows",
  popular: "Popular TV Shows",
  top_rated: "Top Rated TV Shows",
  on_the_air: "Currently Airing Shows",
};

const pageTypeToDescription = {
  home: "Explore thousands of TV shows, from blockbuster series to hidden gems",
  popular: "Check out what everyone's watching right now",
  top_rated: "The highest-rated TV series of all time",
  on_the_air: "TV shows currently airing new episodes",
};

const backgroundImages = {
  home: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg", // Stranger Things
  popular:
    "https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnNIh.jpg", // Breaking Bad
  top_rated:
    "https://image.tmdb.org/t/p/original/mZjZgY6OqQVVJBt0UFzAPPfrDZy.jpg", // Game of Thrones
  on_the_air:
    "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg", // The Last of Us
};

const TVShowsPage = ({ pageType = "top_rated" }) => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetails, setShowDetails] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [watchingShowId, setWatchingShowId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("top_rated");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const backgroundImage = backgroundImages[pageType] || backgroundImages.home;

  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery("");
    setSelectedGenre("");
    setSelectedYear("");
  }, [pageType]);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const genreData = await fetchGenres("tv");
        setGenres(genreData || []);
      } catch (error) {
        console.error("Failed to fetch TV genres:", error);
        setGenres([]);
      }
    };

    getGenres();
  }, []);

  useEffect(() => {
    const getShows = async () => {
      setLoading(true);
      try {
        let data;
        if (searchQuery && searchQuery.trim() !== "") {
          data = await searchTVShows(searchQuery, currentPage);
        } else {
          const params = {
            page: currentPage,
            ...(selectedGenre ? { with_genres: selectedGenre } : {}),
            ...(selectedYear ? { first_air_date_year: selectedYear } : {}),
          };

          switch (selectedCategory) {
            case "popular":
              data = await fetchPopularTVShows(currentPage, params);
              break;
            case "top_rated":
              data = await fetchTopRatedTVShows(currentPage, params);
              break;
            case "on_the_air":
              data = await fetchOnAirTVShows(currentPage, params);
              break;
            default:
              data = await fetchPopularTVShows(currentPage, params);
          }
        }

        if (!data || !data.results) {
          console.error("Invalid data format received from API");
          setShows([]);
          setTotalPages(0);
          return;
        }

        setShows(data.results);
        setTotalPages(data.total_pages || 0);
      } catch (error) {
        console.error("Failed to fetch TV shows:", error);
        setShows([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    getShows();
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

  const handleShowClick = async (showId) => {
    try {
      const details = await fetchTVShowDetails(showId);
      setShowDetails(details);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch TV show details:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setShowDetails(null);
  };

  const handleWatchClick = (showId) => {
    setWatchingShowId(showId);
    setDialogOpen(false);
    setShowDetails(null);
    window.scrollTo(0, 0);
  };

  const handleBackFromWatch = () => {
    setWatchingShowId(null);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  const pageTitle = pageTypeToTitle[pageType] || "Discover TV Shows";
  const pageDescription =
    pageTypeToDescription[pageType] || "Explore thousands of TV shows";

  if (watchingShowId) {
    return (
      <ServerProvider>
        <WatchTVShowPage tvId={watchingShowId} onBack={handleBackFromWatch} />
      </ServerProvider>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(to bottom, rgba(15, 15, 30, 0.9), rgba(26, 26, 46, 0.95)), 
                    url(${backgroundImage}) no-repeat center center / cover fixed`,
        py: 4,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          backgroundImage: "url(/noise.png)",
          opacity: 0.03,
          pointerEvents: "none",
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
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
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {pageTitle}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              maxWidth: 600,
              mx: "auto",
              mb: 4,
              color: "rgba(255,255,255,0.8)",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}
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
              isTV={true}
            />
          </Paper>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <Loader />
          </Box>
        ) : shows && shows.length > 0 ? (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 600,
                borderLeft: `4px solid ${theme.palette.primary.main}`,
                pl: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : pageType === "home"
                  ? "Popular TV Shows"
                  : pageTitle}
              </span>
              {selectedGenre && genres.length > 0 && (
                <Chip
                  label={
                    genres.find((g) => g.id === parseInt(selectedGenre))
                      ?.name || ""
                  }
                  color="primary"
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Typography>
            <MovieGrid
              movies={shows}
              onMovieClick={handleShowClick}
              onWatchClick={handleWatchClick}
              isTV={true}
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
              No TV shows found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters to find what you're looking
              for.
            </Typography>
          </Paper>
        )}
      </Container>

      <Dialog
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
        open={dialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogContent sx={{ p: 0 }}>
          <MovieDetail
            movie={showDetails}
            onClose={handleCloseDialog}
            onWatchClick={handleWatchClick}
            isTV={true}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TVShowsPage;
