import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Stack,
  Fade,
  CircularProgress,
  Typography,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

const VideoPlayer = ({ movieId }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const iframeRef = useRef(null);

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setError(true);
    setLoading(false);
  };

  let sourceUrl;
  if (movieId && movieId.startsWith("movie?tmdb=")) {
    const tmdbId = movieId.replace("movie?tmdb=", "");
    sourceUrl = `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
  } else if (movieId) {
    sourceUrl = `https://vidsrc.me/embed/movie?tmdb=${movieId}`;
  } else {
    sourceUrl = null;
  }

  return (
    <Box
      ref={playerContainerRef}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        bgcolor: "black",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
    >
      {error ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "white",
          }}
        >
          <Typography variant="body1" gutterBottom>
            Unable to load video
          </Typography>
          <Typography variant="body2">
            Please try another server or check back later
          </Typography>
        </Box>
      ) : (
        <>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                bgcolor: "rgba(0,0,0,0.7)",
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          )}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {sourceUrl && (
              <iframe
                ref={iframeRef}
                src={sourceUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                title="Movie Player"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                style={{ border: "none" }}
                sandbox="allow-same-origin allow-scripts allow-forms"
              />
            )}
          </Box>
        </>
      )}

      <Fade in={showControls}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.7) 100%)",
            opacity: showControls ? 1 : 0,
            transition: "opacity 0.3s",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ p: 2, justifyContent: "flex-end", pointerEvents: "auto" }}
          >
            <IconButton onClick={handleFullscreenToggle} color="inherit">
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Stack>
        </Box>
      </Fade>
    </Box>
  );
};

export default VideoPlayer;
