import React from "react";
import { Grid, Box } from "@mui/material";
import MovieCard from "./MovieCard";
import MovieSkeleton from "../common/MovieSkeleton";

const MovieGrid = ({
  movies,
  onMovieClick,
  onWatchClick,
  loading,
  isTV = false,
}) => {
  if (loading) {
    return (
      <Box sx={{ my: 4 }}>
        <Grid container spacing={3}>
          {[...Array(12)].map((_, index) => (
            <Grid item key={index} xs={6} sm={4} md={3} lg={2.4}>
              <MovieSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={6} sm={4} md={3} lg={2.4}>
            <MovieCard
              movie={movie}
              onClick={onMovieClick}
              onWatchClick={onWatchClick}
              isTV={isTV}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MovieGrid;
