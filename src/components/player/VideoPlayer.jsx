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

const VideoPlayer = ({ url, isLoading }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState(false);
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
    setError(false);
  };

  const handleIframeError = () => {
    setError(true);
  };

  // Show loading state if URL is being fetched
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          bgcolor: "rgba(0,0,0,0.7)",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
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
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {url && (
              <iframe
                ref={iframeRef}
                src={url}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title="Video Player"
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            )}
          </Box>

          <Fade in={showControls}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                zIndex: 2,
              }}
            >
              <IconButton
                onClick={handleFullscreenToggle}
                sx={{ color: "white", bgcolor: "rgba(0,0,0,0.5)" }}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Stack>
          </Fade>
        </>
      )}
    </Box>
  );
};

export default VideoPlayer;
