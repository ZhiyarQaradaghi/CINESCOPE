import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Rating,
  Grid,
  Divider,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  Button,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useAuth } from "../../contexts/AuthContext";
import { addToFavorites, removeFromFavorites } from "../../services/movieApi";

const MovieDetail = ({ movie, onClose, onWatchClick }) => {
  const theme = useTheme();
  const { user, favorites, loadFavorites } = useAuth();
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);

  if (!movie) return null;

  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster+Available";

  const backdropPath = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const trailer = movie.videos?.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  const isFavorite = favorites?.some((fav) => fav.id === movie.id);

  const handleFavoriteToggle = async () => {
    if (!user) return; // if the user is not logged in
    setIsUpdatingFavorite(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(movie.id);
      } else {
        await addToFavorites(movie.id);
      }
      await loadFavorites();
    } catch (error) {
      console.error("Error updating favorites:", error);
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "white",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          zIndex: 2,
          "&:hover": {
            bgcolor: "rgba(255, 0, 0, 0.7)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {backdropPath && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "300px",
            backgroundImage: `url(${backdropPath})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            opacity: 0.3,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100px",
              background: `linear-gradient(to bottom, transparent, ${theme.palette.background.paper})`,
            },
          }}
        />
      )}

      <Box sx={{ position: "relative", p: 3, pt: backdropPath ? "220px" : 3 }}>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mb: 3, gap: 2 }}
        >
          {user && (
            <Tooltip
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <IconButton
                onClick={handleFavoriteToggle}
                disabled={isUpdatingFavorite}
                color={isFavorite ? "error" : "default"}
                sx={{
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.8)",
                    color: isFavorite ? "error.main" : "primary.main",
                  },
                  border: isFavorite
                    ? `1px solid ${theme.palette.error.main}`
                    : "none",
                  width: 45,
                  height: 45,
                }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Tooltip>
          )}
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => onWatchClick(movie.id)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              background: "linear-gradient(90deg, #646cff, #ff64c8)",
              fontWeight: 500,
              px: 3,
              py: 1,
            }}
          >
            Watch Movie
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={3}>
            <Card elevation={6}>
              <CardMedia
                component="img"
                image={posterPath}
                alt={movie.title}
                sx={{ width: "100%", height: "auto" }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} sm={8} md={9}>
            <Typography variant="h4" component="h1" gutterBottom>
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

            <Typography variant="h6" gutterBottom>
              Overview
            </Typography>
            <Typography variant="body1" paragraph>
              {movie.overview || "No overview available."}
            </Typography>

            {movie.credits && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Cast
                </Typography>
                <Grid container spacing={2}>
                  {movie.credits.cast?.slice(0, 6).map((person) => (
                    <Grid item key={person.id} xs={4} sm={4} md={2}>
                      <Card sx={{ height: "100%" }}>
                        {person.profile_path ? (
                          <CardMedia
                            component="img"
                            image={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                            alt={person.name}
                            sx={{ aspectRatio: "2/3", objectFit: "cover" }}
                          />
                        ) : (
                          <Box
                            sx={{
                              aspectRatio: "2/3",
                              bgcolor: "grey.800",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "2rem",
                              color: "grey.500",
                            }}
                          >
                            {person.name.charAt(0)}
                          </Box>
                        )}
                        <CardContent sx={{ py: 1 }}>
                          <Typography variant="subtitle2" noWrap>
                            {person.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {person.character}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {trailer && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Trailer
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    paddingBottom: "56.25%", // 16:9 aspect ratio
                    height: 0,
                    overflow: "hidden",
                    borderRadius: 1,
                    "& iframe": {
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    },
                  }}
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default MovieDetail;
