import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
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
  FormControl,
  InputLabel,
  Select,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { fetchTVShowDetails, fetchTVShowSeason } from "../services/tvApi";
import { addToFavorites, removeFromFavorites } from "../services/movieApi";
import Loader from "../components/common/Loader";
import CommentSection from "../components/comments/CommentSection";
import VideoPlayer from "../components/player/VideoPlayer";
import ServerList from "../components/player/ServerList";
import { useServer } from "../contexts/ServerContext";
import { useAuth } from "../contexts/AuthContext";
import { makeRequest } from "../services/apiUtils";

const WatchTVShowPage = ({ tvId, onBack }) => {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [shareMenuAnchor, setShareMenuAnchor] = useState(null);
  const { user, favorites, loadFavorites } = useAuth();
  const { currentSource, setCurrentSource } = useServer();
  const [streamingUrl, setStreamingUrl] = useState("");
  const [loadingUrl, setLoadingUrl] = useState(true);
  const [tvStreamingSources, setTvStreamingSources] = useState({});

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        console.log("Fetching TV show details for ID:", tvId);
        setLoading(true);
        const details = await fetchTVShowDetails(tvId);
        console.log("TV show details received:", details);
        setShow(details);

        // season 1 is default
        if (details.seasons && details.seasons.length > 0) {
          // find first regular season
          const firstRegularSeason = details.seasons.find(
            (s) => s.season_number > 0
          );
          if (firstRegularSeason) {
            setSelectedSeason(firstRegularSeason.season_number);
          }
        }
      } catch (error) {
        console.error("Error fetching TV show details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [tvId]);

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      if (!show || !selectedSeason) return;

      try {
        setLoading(true);
        const seasonDetails = await fetchTVShowSeason(tvId, selectedSeason);
        setSeasonData(seasonDetails);

        // episode 1 is default when changing seasons
        if (seasonDetails.episodes && seasonDetails.episodes.length > 0) {
          setSelectedEpisode(1);
        }
      } catch (error) {
        console.error("Error fetching season details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonDetails();
  }, [tvId, selectedSeason, show]);

  useEffect(() => {
    const fetchStreamingUrl = async () => {
      if (!tvId || !selectedSeason || !selectedEpisode) return;

      setLoadingUrl(true);
      try {
        const response = await makeRequest(
          `/tv/${tvId}/streaming-sources?season=${selectedSeason}&episode=${selectedEpisode}`
        );

        console.log("Full TV API response:", response);

        if (response) {
          setTvStreamingSources(response);

          if (response[currentSource]) {
            setStreamingUrl(response[currentSource]);
          } else {
            console.log("No streaming URL found for source:", currentSource);
            const firstAvailableSource = Object.keys(response).find(
              (key) =>
                response[key] &&
                typeof response[key] === "string" &&
                key !== "imdbId"
            );
            if (firstAvailableSource) {
              setCurrentSource(firstAvailableSource);
              setStreamingUrl(response[firstAvailableSource]);
            } else {
              setStreamingUrl("");
            }
          }
        } else {
          setStreamingUrl("");
        }
      } catch (error) {
        console.error("Error fetching streaming URL:", error);
        setStreamingUrl("");
      } finally {
        setLoadingUrl(false);
      }
    };

    fetchStreamingUrl();
  }, [tvId, selectedSeason, selectedEpisode, currentSource]);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleEpisodeSelect = (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
  };

  const handleShareClick = (event) => {
    setShareMenuAnchor(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareMenuAnchor(null);
  };

  const handleShare = async (platform) => {
    const showUrl = `${window.location.origin}/tv/${tvId}`;
    const showTitle = show?.name || "this TV show";
    let shareUrl;

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=Check out ${showTitle} on CineScope!&url=${encodeURIComponent(
          showUrl
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          showUrl
        )}`;
        break;
      case "reddit":
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
          showUrl
        )}&title=Check out ${showTitle} on CineScope!`;
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(showUrl);
          setSnackbarMessage("Link copied to clipboard!");
          setSnackbarOpen(true);
        } catch (err) {
          console.error("Failed to copy link:", err);
        }
        handleShareClose();
        return;
      default:
        handleShareClose();
        return;
    }

    window.open(shareUrl, "_blank");
    handleShareClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFavoriteToggle = async () => {
    if (!user) return;

    try {
      const isFavorite = favorites?.some((fav) => fav.id === show.id);

      if (isFavorite) {
        await removeFromFavorites(show.id);
        setSnackbarMessage("Removed from favorites");
      } else {
        await addToFavorites(show.id);
        setSnackbarMessage("Added to favorites");
      }

      await loadFavorites();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (loading && !show) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader />
      </Box>
    );
  }

  if (!show) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4, textAlign: "center" }}>
          TV Show not found
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="contained" onClick={onBack}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  const currentEpisode = seasonData?.episodes?.find(
    (ep) => ep.episode_number === selectedEpisode
  );

  const isFavorite = favorites?.some((fav) => fav.id === show.id);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(20,20,40,0.8)), url(https://image.tmdb.org/t/p/original${show?.backdrop_path}) no-repeat center center / cover`,
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
            {show.name}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, flexWrap: "wrap", alignItems: "center" }}
          >
            {show.first_air_date && (
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                {new Date(show.first_air_date).getFullYear()}
              </Typography>
            )}
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              •
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Rating
                value={show.vote_average / 2}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography
                variant="body2"
                sx={{ ml: 0.5, color: "rgba(255,255,255,0.7)" }}
              >
                {show.vote_average ? show.vote_average.toFixed(1) : "N/A"}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
              {show.number_of_seasons} Season
              {show.number_of_seasons !== 1 ? "s" : ""}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}
          >
            {show.genres?.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "white",
                  backdropFilter: "blur(8px)",
                }}
              />
            ))}
          </Stack>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2 }}>
              <ServerList
                currentSource={currentSource}
                onSourceChange={setCurrentSource}
                streamingSources={tvStreamingSources}
              />
            </Box>

            <Box
              sx={{
                position: "relative",
                width: "100%",
                bgcolor: "rgba(0,0,0,0.5)",
                borderRadius: 2,
                overflow: "hidden",
                mb: 3,
              }}
            >
              <Box sx={{ position: "relative", paddingTop: "56.25%" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <VideoPlayer url={streamingUrl} isLoading={loadingUrl} />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FormControl
                  variant="outlined"
                  sx={{
                    minWidth: 120,
                    bgcolor: "rgba(0,0,0,0.3)",
                    borderRadius: 1,
                  }}
                  size="small"
                >
                  <InputLabel id="season-select-label" sx={{ color: "white" }}>
                    Season
                  </InputLabel>
                  <Select
                    labelId="season-select-label"
                    value={selectedSeason}
                    onChange={handleSeasonChange}
                    label="Season"
                    sx={{ color: "white" }}
                  >
                    {show.seasons
                      ?.filter((season) => season.season_number > 0)
                      .map((season) => (
                        <MenuItem key={season.id} value={season.season_number}>
                          Season {season.season_number}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                {currentEpisode && (
                  <Typography variant="h6" sx={{ color: "white" }}>
                    Episode {currentEpisode.episode_number}:{" "}
                    {currentEpisode.name}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                {user && (
                  <Tooltip
                    title={
                      isFavorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <IconButton
                      onClick={handleFavoriteToggle}
                      sx={{
                        color: isFavorite ? "error.main" : "white",
                        bgcolor: "rgba(0,0,0,0.3)",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
                      }}
                    >
                      {isFavorite ? <BookmarkAddedIcon /> : <BookmarkAddIcon />}
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Share">
                  <IconButton
                    onClick={handleShareClick}
                    sx={{
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.3)",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {currentEpisode && (
              <Paper
                sx={{
                  p: 3,
                  mb: 4,
                  bgcolor: "rgba(0,0,0,0.3)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {currentEpisode.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="rgba(255,255,255,0.7)"
                  gutterBottom
                >
                  Air date: {currentEpisode.air_date || "Unknown"}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {currentEpisode.overview ||
                    "No overview available for this episode."}
                </Typography>
              </Paper>
            )}

            <CommentSection contentId={tvId} contentType="tv" />
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                bgcolor: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
                color: "white",
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Episodes
              </Typography>
              <Divider sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.1)" }} />

              <List sx={{ maxHeight: 400, overflow: "auto" }}>
                {seasonData?.episodes?.map((episode) => (
                  <ListItem
                    key={episode.id}
                    disablePadding
                    sx={{
                      mb: 1,
                      bgcolor:
                        episode.episode_number === selectedEpisode
                          ? "rgba(100, 108, 255, 0.3)"
                          : "transparent",
                      borderRadius: 1,
                    }}
                  >
                    <ListItemButton
                      onClick={() =>
                        handleEpisodeSelect(episode.episode_number)
                      }
                      sx={{ borderRadius: 1 }}
                    >
                      <ListItemText
                        primary={`${episode.episode_number}. ${episode.name}`}
                        secondary={
                          <Typography
                            variant="body2"
                            color="rgba(255,255,255,0.6)"
                          >
                            {episode.air_date || "No air date"}
                          </Typography>
                        }
                      />
                      {episode.episode_number === selectedEpisode && (
                        <PlayArrowIcon color="primary" />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Paper
              sx={{
                p: 2,
                bgcolor: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
                color: "white",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                About the Show
              </Typography>
              <Divider sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.1)" }} />
              <Typography variant="body2" paragraph>
                {show.overview || "No overview available."}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  First Air Date
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {show.first_air_date || "Unknown"}
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {show.status || "Unknown"}
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  Networks
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 2, flexWrap: "wrap" }}
                >
                  {show.networks?.map((network) => (
                    <Chip
                      key={network.id}
                      label={network.name}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Menu
        anchorEl={shareMenuAnchor}
        open={Boolean(shareMenuAnchor)}
        onClose={handleShareClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={() => handleShare("twitter")}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Twitter
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleShare("facebook")}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Facebook
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleShare("reddit")}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Reddit
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleShare("copy")}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            Copy Link
          </Box>
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WatchTVShowPage;
