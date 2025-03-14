import React, { useState, useRef } from "react";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Stack,
  Fade,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

const VideoPlayer = ({ movieId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const playerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  const handleVolumeChange = (_, newValue) => {
    const volumeValue = newValue / 100;
    setVolume(volumeValue);
    setIsMuted(volumeValue === 0);
    if (playerRef.current) {
      playerRef.current.volume = volumeValue;
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current) {
      playerRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (_, newValue) => {
    if (playerRef.current) {
      playerRef.current.currentTime = (newValue / 100) * duration;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        bgcolor: "#000",
        borderRadius: 2,
        overflow: "hidden",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <Box
        component="video"
        ref={playerRef}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        poster={`https://image.tmdb.org/t/p/original/movie/${movieId}/backdrop.jpg`}
      >
        <source src="" type="video/mp4" />
        Your browser does not support the video tag.
      </Box>

      <Fade in={showControls}>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "rgba(0, 0, 0, 0.7)",
            p: 2,
            transition: "opacity 0.3s",
          }}
        >
          <Stack spacing={1}>
            <Slider
              value={(currentTime / duration) * 100 || 0}
              onChange={handleSeek}
              sx={{
                color: "#646cff",
                height: 4,
                "& .MuiSlider-thumb": {
                  width: 8,
                  height: 8,
                  transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                  "&:hover, &.Mui-focusVisible": {
                    boxShadow: "none",
                  },
                },
              }}
            />

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  onClick={handlePlayPause}
                  sx={{ color: "white" }}
                  size="small"
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>

                <Box sx={{ display: "flex", alignItems: "center", width: 200 }}>
                  <IconButton
                    onClick={handleMuteToggle}
                    sx={{ color: "white" }}
                    size="small"
                  >
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                  </IconButton>
                  <Slider
                    value={isMuted ? 0 : volume * 100}
                    onChange={handleVolumeChange}
                    sx={{
                      width: 100,
                      ml: 1,
                      color: "#646cff",
                    }}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>
              </Box>

              <IconButton
                onClick={handleFullscreenToggle}
                sx={{ color: "white" }}
                size="small"
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </Fade>

      {!isPlaying && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <IconButton
            onClick={handlePlayPause}
            sx={{
              color: "white",
              bgcolor: "rgba(100, 108, 255, 0.8)",
              "&:hover": {
                bgcolor: "rgba(100, 108, 255, 0.9)",
              },
              width: 64,
              height: 64,
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default VideoPlayer;
