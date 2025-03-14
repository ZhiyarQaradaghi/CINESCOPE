import React from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../../contexts/AuthContext";

const CommentSection = () => {
  const { user } = useAuth();

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "rgba(30, 30, 46, 0.7)",
        backdropFilter: "blur(10px)",
        mt: 3,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {user ? (
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Avatar
            src={user.photoURL}
            alt={user.displayName}
            sx={{ width: 40, height: 40 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              placeholder="Share your thoughts..."
              multiline
              rows={2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(0, 0, 0, 0.2)",
                },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                sx={{
                  background: "linear-gradient(90deg, #646cff, #ff64c8)",
                  textTransform: "none",
                }}
              >
                Post Comment
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: "rgba(0, 0, 0, 0.2)",
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Please sign in to leave a comment
          </Typography>
        </Box>
      )}

      <Stack spacing={3}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No comments yet. Be the first to share your thoughts!
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default CommentSection;
