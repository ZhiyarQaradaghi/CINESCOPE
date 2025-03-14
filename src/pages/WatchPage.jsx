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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideoPlayer from "../components/player/VideoPlayer";
import { fetchMovieDetails } from "../services/movieApi";
import Loader from "../components/common/Loader";

const WatchPage = ({ movieId, onBack }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

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

        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            mb: 4,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <VideoPlayer movieId={movieId} />
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "rgba(30, 30, 46, 0.7)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Rating
                      value={movie.vote_average / 2}
                      precision={0.5}
                      readOnly
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {movie.vote_average?.toFixed(1)}/10
                    </Typography>
                  </Box>

                  {movie.runtime && (
                    <Typography variant="body2" color="text.secondary">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {movie.genres?.map((genre) => (
                      <Chip key={genre.id} label={genre.name} size="small" />
                    ))}
                  </Box>
                </Box>

                {movie.tagline && (
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", mb: 2 }}
                  >
                    {movie.tagline}
                  </Typography>
                )}
              </Box>

              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1" paragraph>
                {movie.overview || "No overview available."}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                bgcolor: "rgba(30, 30, 46, 0.7)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Watch Options
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                This is a placeholder for watch options, streaming providers, or
                other related functionality.
              </Typography>

              <Typography variant="body2" paragraph>
                In a complete implementation, this area could include:
              </Typography>

              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2">
                  Streaming quality options
                </Typography>
                <Typography component="li" variant="body2">
                  Audio and subtitle settings
                </Typography>
                <Typography component="li" variant="body2">
                  Playback controls
                </Typography>
                <Typography component="li" variant="body2">
                  Recommended movies
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WatchPage;
