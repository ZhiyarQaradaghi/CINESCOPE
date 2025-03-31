import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";

const ServerList = ({ currentSource, onSourceChange, streamingSources }) => {
  if (!streamingSources || Object.keys(streamingSources).length === 0) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          No streaming servers available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <FormControl
        fullWidth
        variant="outlined"
        sx={{
          bgcolor: "rgba(30, 30, 46, 0.7)",
          borderRadius: 2,
          backdropFilter: "blur(10px)",
        }}
        size="small"
      >
        <InputLabel id="server-select-label" sx={{ color: "white" }}>
          Streaming Server
        </InputLabel>
        <Select
          labelId="server-select-label"
          value={currentSource}
          onChange={(e) => onSourceChange(e.target.value)}
          label="Streaming Server"
          sx={{
            color: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          }}
        >
          {Object.entries(streamingSources).map(([key, name]) => {
            if (key === "movieId" || key === "imdbId") return null;

            return (
              <MenuItem key={key} value={key}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ServerList;
