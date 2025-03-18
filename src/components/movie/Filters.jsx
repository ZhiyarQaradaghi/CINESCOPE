import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";

const Filters = ({
  genres,
  selectedGenre,
  onGenreChange,
  yearRange,
  onYearChange,
  category,
  onCategoryChange,
  isTV = false,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => currentYear - i);

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          "& .MuiFormControl-root": {
            minWidth: 150,
            flex: { xs: "1 0 100%", sm: "1 0 auto" },
          },
        }}
      >
        <FormControl>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={category}
            label="Category"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <MenuItem value="popular">Popular</MenuItem>
            <MenuItem value="top_rated">Top Rated</MenuItem>
            {isTV ? (
              <MenuItem value="on_the_air">On Air</MenuItem>
            ) : (
              <MenuItem value="upcoming">Upcoming</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="genre-select-label">Genre</InputLabel>
          <Select
            labelId="genre-select-label"
            value={selectedGenre}
            label="Genre"
            onChange={(e) => onGenreChange(e.target.value)}
          >
            <MenuItem value="">All Genres</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="year-select-label">
            {isTV ? "First Air Date" : "Release Year"}
          </InputLabel>
          <Select
            labelId="year-select-label"
            value={yearRange}
            label={isTV ? "First Air Date" : "Release Year"}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <MenuItem value="">All Years</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default Filters;
