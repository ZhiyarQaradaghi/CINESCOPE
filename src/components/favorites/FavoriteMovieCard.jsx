import { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  CardActionArea,
  Tooltip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useAuth } from "../../contexts/AuthContext";
import { addToFavorites, removeFromFavorites } from "../../services/movieApi";

const MovieCard = ({ movie, onClick, isFavorite = false }) => {
  const [loading, setLoading] = useState(false);
  const { user, loadFavorites } = useAuth();

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (!user) {
      // could add a notification to the user or redirect to the login page
      return;
    }

    setLoading(true);
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
      setLoading(false);
    }
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height="300"
          image={posterUrl}
          alt={movie.title}
          sx={{ objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "50%",
            p: 0.5,
          }}
        >
          <Chip
            icon={
              <StarIcon fontSize="small" sx={{ color: "#FFD700 !important" }} />
            }
            label={movie.vote_average?.toFixed(1) || "N/A"}
            size="small"
            sx={{
              bgcolor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              "& .MuiChip-label": { pl: 0 },
            }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {releaseYear}
          </Typography>
        </CardContent>
      </CardActionArea>

      {user && (
        <Box sx={{ position: "absolute", bottom: 10, right: 10 }}>
          <Tooltip
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <IconButton
              onClick={handleFavoriteClick}
              disabled={loading}
              color={isFavorite ? "error" : "default"}
              sx={{
                bgcolor: "rgba(0, 0, 0, 0.6)",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.8)" },
              }}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Card>
  );
};

export default MovieCard;
