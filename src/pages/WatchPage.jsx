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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { fetchMovieDetails } from "../services/movieApi";
import Loader from "../components/common/Loader";
import CommentSection from "../components/comments/CommentSection";
import VideoPlayer from "../components/player/VideoPlayer";
import ServerList from "../components/player/ServerList";
import { useServer } from "../contexts/ServerContext";

const WatchPage = ({ movieId, onBack }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentSource, setCurrentSource } = useServer();

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
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              mb: 2,
            }}
          >
            <ArrowBackIcon /> Back
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

          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
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
          </Stack>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={9}>
            {/* Video Player */}
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
            {/* Server List */}
            <ServerList
              currentSource={currentSource}
              onSourceChange={setCurrentSource}
              streamingSources={streamingSources}
            />

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
    </Box>
  );
};

export default WatchPage;
