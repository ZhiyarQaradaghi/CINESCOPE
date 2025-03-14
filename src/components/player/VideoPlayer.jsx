import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const VideoPlayer = ({ movieId }) => {
  // Placeholder for a real video player
  return (
    <Box
      sx={{
        width: "100%",
        aspectRatio: "16/9",
        bgcolor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        Video player will appear here
      </Typography>

      {/* This would be replaced with an actual player in a real implementation */}
      <Box
        component="img"
        src={`https://image.tmdb.org/t/p/original/movie/${movieId}/backdrop.jpg`}
        alt="Movie backdrop"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.3,
        }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    </Box>
  );
};

export default VideoPlayer;
