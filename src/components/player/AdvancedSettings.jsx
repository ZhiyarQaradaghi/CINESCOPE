import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import ContrastIcon from "@mui/icons-material/Contrast";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import TuneIcon from "@mui/icons-material/Tune";

const AdvancedSettings = ({ open, onClose }) => {
  const [volume, setVolume] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [audioTrack, setAudioTrack] = useState("default");
  const [autoQuality, setAutoQuality] = useState(true);
  const [audioBoost, setAudioBoost] = useState(false);
  const [noiseReduction, setNoiseReduction] = useState(false);

  const handleReset = () => {
    setVolume(100);
    setBrightness(100);
    setContrast(100);
    setAudioTrack("default");
    setAutoQuality(true);
    setAudioBoost(false);
    setNoiseReduction(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "rgba(30, 30, 46, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TuneIcon sx={{ mr: 1 }} />
          Advanced Settings
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <VolumeUpIcon sx={{ mr: 1 }} />
              Volume
            </Typography>
            <Slider
              value={volume}
              onChange={(_, value) => setVolume(value)}
              valueLabelDisplay="auto"
              min={0}
              max={200}
              marks={[
                { value: 0, label: "0%" },
                { value: 100, label: "100%" },
                { value: 200, label: "200%" },
              ]}
            />
          </Box>

          <Box>
            <Typography
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <BrightnessHighIcon sx={{ mr: 1 }} />
              Brightness
            </Typography>
            <Slider
              value={brightness}
              onChange={(_, value) => setBrightness(value)}
              valueLabelDisplay="auto"
              min={50}
              max={150}
            />
          </Box>

          <Box>
            <Typography
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ContrastIcon sx={{ mr: 1 }} />
              Contrast
            </Typography>
            <Slider
              value={contrast}
              onChange={(_, value) => setContrast(value)}
              valueLabelDisplay="auto"
              min={50}
              max={150}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>Audio Track</InputLabel>
            <Select
              value={audioTrack}
              onChange={(e) => setAudioTrack(e.target.value)}
              label="Audio Track"
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="stereo">Stereo</MenuItem>
              <MenuItem value="surround">5.1 Surround</MenuItem>
              <MenuItem value="dolby">Dolby Digital</MenuItem>
            </Select>
          </FormControl>

          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoQuality}
                  onChange={(e) => setAutoQuality(e.target.checked)}
                />
              }
              label="Auto-adjust Quality"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={audioBoost}
                  onChange={(e) => setAudioBoost(e.target.checked)}
                />
              }
              label="Audio Boost"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={noiseReduction}
                  onChange={(e) => setNoiseReduction(e.target.checked)}
                />
              }
              label="Noise Reduction"
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleReset} variant="outlined" color="error">
          Reset All
        </Button>
        <Button onClick={onClose} variant="contained">
          Apply Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvancedSettings;
