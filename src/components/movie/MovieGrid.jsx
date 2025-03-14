import React from "react";
import { Grid, Box } from "@mui/material";
import MovieCard from "./MovieCard";

const MovieGrid = ({ movies, onMovieClick, onWatchClick }) => {
  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={6} sm={4} md={3} lg={2.4}>
            <MovieCard
              movie={movie}
              onClick={onMovieClick}
              onWatchClick={onWatchClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MovieGrid;
