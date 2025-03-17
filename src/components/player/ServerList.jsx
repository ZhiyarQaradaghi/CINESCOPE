import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const ServerList = ({ currentSource, onSourceChange, streamingSources }) => {
  const serverNames = {
    vidsrc: "VidSrc",
    fsapi: "FSAPI",
    curtstream: "CurtStream",
    moviewp: "MovieWP",
    apimdb: "ApiMDB",
    gomo: "GoMo",
    vidcloud: "VidCloud",
    superembed: "SuperEmbed",
  };

  if (!streamingSources) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "rgba(30, 30, 46, 0.7)",
        backdropFilter: "blur(10px)",
        mb: 3,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Available Servers
      </Typography>
      <List sx={{ width: "100%" }}>
        {Object.entries(streamingSources).map(([key]) => {
          if (key === "movieId") return null;

          return (
            <ListItem key={key} disablePadding>
              <ListItemButton
                selected={currentSource === key}
                onClick={() => onSourceChange(key)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  "&.Mui-selected": {
                    bgcolor: "rgba(100, 108, 255, 0.2)",
                  },
                  "&:hover": {
                    bgcolor: "rgba(100, 108, 255, 0.1)",
                  },
                }}
              >
                <ListItemText primary={serverNames[key] || key} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default ServerList;
