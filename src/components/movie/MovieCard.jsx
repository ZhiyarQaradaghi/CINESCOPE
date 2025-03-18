import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  Button,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const MovieCard = ({ movie, onClick, onWatchClick, isTV = false }) => {
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : movie.first_air_date
    ? movie.first_air_date.substring(0, 4)
    : "N/A";

  // name for tv shows, title for movies
  const title = isTV ? movie.name : movie.title;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <Box sx={{ cursor: "pointer" }} onClick={() => onClick(movie.id)}>
        <CardMedia
          component="img"
          image={posterPath}
          alt={title}
          sx={{
            aspectRatio: "2/3",
            objectFit: "cover",
          }}
        />
        <CardContent>
          <Typography variant="h6" component="div" noWrap>
            {title || "N/A"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {releaseYear}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Rating
                value={movie.vote_average / 2}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Box>
      <Box sx={{ mt: "auto", p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<PlayArrowIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onWatchClick(movie.id);
          }}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            background: "linear-gradient(90deg, #646cff, #ff64c8)",
            fontWeight: 500,
          }}
        >
          {isTV ? "Watch Show" : "Watch Movie"}
        </Button>
      </Box>
    </Card>
  );
};

export default MovieCard;
