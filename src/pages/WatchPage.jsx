import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  IconButton,
  Chip,
  Divider,
  Grid,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SettingsIcon from "@mui/icons-material/Settings";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import SpeedIcon from "@mui/icons-material/Speed";
import QualityIcon from "@mui/icons-material/HighQuality";
import VideoPlayer from "../components/player/VideoPlayer";
import { fetchMovieDetails } from "../services/movieApi";
import Loader from "../components/common/Loader";
import AdvancedSettings from "../components/player/AdvancedSettings";
import CommentSection from "../components/comments/CommentSection";

const WatchPage = ({ movieId, onBack }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quality, setQuality] = useState("1080p");
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [subtitle, setSubtitle] = useState("English");
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        const details = await fetchMovieDetails(movieId);
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

  const handleQualityChange = (event) => {
    setQuality(event.target.value);
  };

  const handleSpeedChange = (event) => {
    setPlaybackSpeed(event.target.value);
  };

  const handleSubtitleChange = (event) => {
    setSubtitle(event.target.value);
  };

  const handleAdvancedSettings = () => {
    setAdvancedSettingsOpen(true);
  };

  const handleCloseAdvancedSettings = () => {
    setAdvancedSettingsOpen(false);
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

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        background: "linear-gradient(to bottom, #0f0f1e 0%, #1a1a2e 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <IconButton
            onClick={onBack}
            sx={{
              color: "white",
              mb: 2,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ArrowBackIcon />
            <Typography sx={{ ml: 1 }}>Back</Typography>
          </IconButton>

          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            {movie.title}
            <Typography
              component="span"
              variant="h5"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              (
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "N/A"}
              )
            </Typography>
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                mb: 4,
                bgcolor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
                position: "relative",
                aspectRatio: "16/9",
              }}
            >
              <VideoPlayer movieId={movieId} />
            </Paper>

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
                {movie.overview || "No overview available."}
              </Typography>
            </Paper>

            <CommentSection movieId={movieId} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "rgba(30, 30, 46, 0.7)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Watch Options
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <QualityIcon sx={{ mr: 1 }} />
                      Quality
                    </Box>
                  </InputLabel>
                  <Select
                    value={quality}
                    onChange={handleQualityChange}
                    label="Quality"
                  >
                    <MenuItem value="4K">4K Ultra HD</MenuItem>
                    <MenuItem value="1080p">1080p Full HD</MenuItem>
                    <MenuItem value="720p">720p HD</MenuItem>
                    <MenuItem value="480p">480p SD</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <SpeedIcon sx={{ mr: 1 }} />
                      Playback Speed
                    </Box>
                  </InputLabel>
                  <Select
                    value={playbackSpeed}
                    onChange={handleSpeedChange}
                    label="Playback Speed"
                  >
                    <MenuItem value={0.5}>0.5x</MenuItem>
                    <MenuItem value={0.75}>0.75x</MenuItem>
                    <MenuItem value={1.0}>Normal</MenuItem>
                    <MenuItem value={1.25}>1.25x</MenuItem>
                    <MenuItem value={1.5}>1.5x</MenuItem>
                    <MenuItem value={2.0}>2x</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <ClosedCaptionIcon sx={{ mr: 1 }} />
                      Subtitles
                    </Box>
                  </InputLabel>
                  <Select
                    value={subtitle}
                    onChange={handleSubtitleChange}
                    label="Subtitles"
                  >
                    <MenuItem value="off">Off</MenuItem>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                    <MenuItem value="French">French</MenuItem>
                    <MenuItem value="German">German</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  startIcon={<SettingsIcon />}
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleAdvancedSettings}
                >
                  Advanced Settings
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <AdvancedSettings
          open={advancedSettingsOpen}
          onClose={handleCloseAdvancedSettings}
        />
      </Container>
    </Box>
  );
};

export default WatchPage;
