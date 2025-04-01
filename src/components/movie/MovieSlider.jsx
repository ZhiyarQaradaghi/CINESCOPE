// src/components/movie/MovieSlider.jsx
import React, { useRef } from "react";
import {
  Box,
  IconButton,
  Card,
  CardMedia,
  Typography,
  Rating,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";

const MovieSlider = ({ movies, onMovieClick, isTV = false }) => {
  const sliderRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth * 0.75,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.offsetWidth * 0.75,
        behavior: "smooth",
      });
    }
  };

  const handleWatchClick = (id, e) => {
    e.stopPropagation();
    if (isTV) {
      navigate(`/watch/tv/${id}/1/1`);
    } else {
      navigate(`/watch/${id}`);
    }
  };

  if (!movies || movies.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        No movies available in this category
      </Typography>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        ref={sliderRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari
          gap: 2,
          py: 2,
          px: 1,
        }}
      >
        {movies.map((movie) => (
          <Card
            key={movie.id}
            sx={{
              minWidth: 200,
              width: 200,
              flexShrink: 0,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 10,
                "& .movie-overlay": {
                  opacity: 1,
                },
              },
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              onClick={() => onMovieClick(movie.id)}
              sx={{ cursor: "pointer" }}
            >
              <CardMedia
                component="img"
                image={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Poster"
                }
                alt={movie.title}
                sx={{ height: 300, objectFit: "cover" }}
              />
              <Box
                className="movie-overlay"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 1.5,
                  background:
                    "linear-gradient(transparent, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.95))",
                  opacity: 0,
                  transition: "opacity 0.3s",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: "white", fontWeight: 600, mb: 0.5 }}
                >
                  {movie.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Rating
                    value={movie.vote_average / 2}
                    precision={0.5}
                    readOnly
                    size="small"
                    sx={{ color: theme.palette.secondary.main }}
                  />
                  <Typography variant="body2" sx={{ ml: 0.5, color: "white" }}>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      "&:hover": { bgcolor: theme.palette.primary.dark },
                    }}
                    onClick={(e) => handleWatchClick(movie.id, e)}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Navigation Arrows */}
      <IconButton
        sx={{
          position: "absolute",
          left: -20,
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
          zIndex: 2,
        }}
        onClick={scrollLeft}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        sx={{
          position: "absolute",
          right: -20,
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "rgba(0,0,0,0.5)",
          color: "white",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
          zIndex: 2,
        }}
        onClick={scrollRight}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default MovieSlider;
