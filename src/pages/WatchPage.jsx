import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
  Grid,
  Chip,
  Stack,
  Button,
  Tooltip,
  Rating,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import DownloadIcon from "@mui/icons-material/Download";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import RedditIcon from "@mui/icons-material/Reddit";
import LinkIcon from "@mui/icons-material/Link";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { fetchMovieDetails } from "../services/movieApi";
import { addToFavorites, removeFromFavorites } from "../services/movieApi";
import Loader from "../components/common/Loader";
import CommentSection from "../components/comments/CommentSection";
import VideoPlayer from "../components/player/VideoPlayer";
import ServerList from "../components/player/ServerList";
import { useServer } from "../contexts/ServerContext";
import { useAuth } from "../contexts/AuthContext";

const WatchPage = ({ movieId, onBack }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentSource, setCurrentSource } = useServer();
  const { user, favorites, loadFavorites } = useAuth();

  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isUpdatingWatchlist, setIsUpdatingWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        console.log("Fetching movie details for ID:", movieId);
        const details = await fetchMovieDetails(movieId);
        console.log("Movie details received:", details);
        setMovie(details);
      } catch (error) {
        console.error("Error loading movie:", error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      loadMovie();
    }
  }, [movieId]);

  useEffect(() => {
    if (user && favorites && movie) {
      setIsInWatchlist(favorites.some((fav) => fav.id === movie.id));
    }
  }, [user, favorites, movie]);

  const handleWatchlistToggle = async () => {
    if (!user) {
      showSnackbar("Please log in to add movies to your watchlist", "error");
      return;
    }

    setIsUpdatingWatchlist(true);
    try {
      if (isInWatchlist) {
        await removeFromFavorites(movie.id);
        showSnackbar("Removed from watchlist", "success");
      } else {
        await addToFavorites(movie.id);
        showSnackbar("Added to watchlist", "success");
      }
      await loadFavorites();
    } catch (error) {
      console.error("Error updating watchlist:", error);
      showSnackbar("Failed to update watchlist", "error");
    } finally {
      setIsUpdatingWatchlist(false);
    }
  };

  const handleRatingSubmit = async (newValue) => {
    if (!user) {
      showSnackbar("Please log in to rate movies", "error");
      return;
    }

    setUserRating(newValue);

    try {
      // call api to save rating
      setIsRatingSubmitted(true);
      showSnackbar("Rating saved!", "success");

      setTimeout(() => {
        setIsRatingSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting rating:", error);
      showSnackbar("Failed to save rating", "error");
    }
  };

  const handleShareClick = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = movie?.title || "Check out this movie";

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(title)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        showSnackbar("Link copied to clipboard!", "success");
        handleShareClose();
        return;
      default:
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank");
    }

    handleShareClose();
  };

  const handleDownload = () => {
    showSnackbar(
      "Download feature will be available in the premium version",
      "info"
    );
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <Loader />
      </Box>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography>Movie not found</Typography>
          <IconButton onClick={onBack} sx={{ mt: 2 }}>
            <ArrowBackIcon /> Go Back
          </IconButton>
        </Paper>
      </Container>
    );
  }

  const streamingSources = movie.imdb_id
    ? { vidsrc: `https://vidsrc.me/embed/${movie.imdb_id}/` }
    : { vidsrc: `https://vidsrc.me/embed/movie?tmdb=${movie.id}` };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(20,20,40,0.8)), url(https://image.tmdb.org/t/p/original${movie?.backdrop_path}) no-repeat center center / cover`,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <IconButton
            onClick={onBack}
            sx={{
              color: "white",
              bgcolor: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)",
              "&:hover": {
                bgcolor: "rgba(100, 108, 255, 0.3)",
                transform: "translateX(-5px)",
              },
              transition: "all 0.3s ease",
              borderRadius: "12px",
              p: 1.5,
              mb: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            <Typography variant="button" sx={{ fontWeight: 500 }}>
              Back to Browse
            </Typography>
          </IconButton>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {movie.title}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, flexWrap: "wrap", alignItems: "center" }}
          >
            <Chip
              label={`${movie.release_date?.split("-")[0] || "Unknown"}`}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
            />
            {movie.runtime && (
              <Chip
                label={`${Math.floor(movie.runtime / 60)}h ${
                  movie.runtime % 60
                }m`}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
              />
            )}
            <Chip
              label={`${movie.vote_average?.toFixed(1)}/10`}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
            />
            {movie.genres?.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
              />
            ))}

            <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
              <Tooltip
                title={
                  isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"
                }
              >
                <IconButton
                  disabled={isUpdatingWatchlist || !user}
                  onClick={handleWatchlistToggle}
                  size="small"
                  sx={{
                    color: isInWatchlist ? "primary.main" : "white",
                    bgcolor: "rgba(0,0,0,0.3)",
                    backdropFilter: "blur(8px)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
                  }}
                >
                  {isInWatchlist ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Share">
                <IconButton
                  size="small"
                  onClick={handleShareClick}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.3)",
                    backdropFilter: "blur(8px)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={shareAnchorEl}
                open={Boolean(shareAnchorEl)}
                onClose={handleShareClose}
                PaperProps={{
                  sx: {
                    bgcolor: "rgba(30, 30, 46, 0.9)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem onClick={() => handleShare("twitter")}>
                  <TwitterIcon sx={{ mr: 1, color: "#1DA1F2" }} />
                  <Typography>Twitter</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleShare("facebook")}>
                  <FacebookIcon sx={{ mr: 1, color: "#4267B2" }} />
                  <Typography>Facebook</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleShare("reddit")}>
                  <RedditIcon sx={{ mr: 1, color: "#FF5700" }} />
                  <Typography>Reddit</Typography>
                </MenuItem>
                <Divider sx={{ my: 1, bgcolor: "rgba(255,255,255,0.1)" }} />
                <MenuItem onClick={() => handleShare("copy")}>
                  <LinkIcon sx={{ mr: 1 }} />
                  <Typography>Copy Link</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={9}>
            {/* This is the video player */}
            <Box
              sx={{
                height: { xs: "300px", sm: "400px", md: "500px" },
                mb: 3,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <VideoPlayer movieId={movie.id.toString()} />
            </Box>

            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "rgba(30, 30, 46, 0.7)",
                backdropFilter: "blur(10px)",
                mb: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1" paragraph>
                {movie?.overview || "No overview available."}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                  mt: 2,
                }}
              >
                {movie.vote_average && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Rating
                    </Typography>
                    <Typography variant="body1">
                      {movie.vote_average.toFixed(1)}/10
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            <CommentSection movieId={movieId} />
          </Grid>

          <Grid item xs={12} lg={3}>
            {/* This is the server list */}
            <ServerList
              currentSource={currentSource}
              onSourceChange={setCurrentSource}
              streamingSources={streamingSources}
            />

            {/* This is the download button */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  backdropFilter: "blur(10px)",
                  bgcolor: "rgba(30, 30, 46, 0.4)",
                  borderColor: "rgba(100, 108, 255, 0.5)",
                  color: "white",
                  "&:hover": {
                    bgcolor: "rgba(30, 30, 46, 0.6)",
                    borderColor: "primary.main",
                  },
                  py: 1,
                }}
              >
                Download for Offline Viewing
              </Button>
            </Box>

            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(30, 30, 46, 0.7)",
                backdropFilter: "blur(10px)",
                mb: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Movie Information
              </Typography>

              {/* This is the user rating */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Your Rating
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Rating
                    value={userRating}
                    onChange={(event, newValue) => {
                      handleRatingSubmit(newValue);
                    }}
                    precision={0.5}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    icon={<StarIcon fontSize="inherit" />}
                  />
                  {isRatingSubmitted && (
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{ ml: 1 }}
                    >
                      Saved!
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Release Date
                </Typography>
                <Typography variant="body1">
                  {movie.release_date || "Unknown"}
                </Typography>
              </Box>

              {movie.production_companies &&
                movie.production_companies.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Production
                    </Typography>
                    <Typography variant="body1">
                      {movie.production_companies
                        .map((company) => company.name)
                        .join(", ")}
                    </Typography>
                  </Box>
                )}

              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Languages
                  </Typography>
                  <Typography variant="body1">
                    {movie.spoken_languages
                      .map((lang) => lang.english_name)
                      .join(", ")}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* This is the snackbar for notifications pop up */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WatchPage;
