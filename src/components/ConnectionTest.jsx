import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { testBackendConnection } from "../utils/connectionTest";

const ConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const runConnectionTest = async () => {
    setLoading(true);
    const result = await testBackendConnection();
    setConnectionStatus(result);
    setLoading(false);
  };

  useEffect(() => {
    // Run test on component mount
    runConnectionTest();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Backend Connection Test
      </Typography>

      <Box sx={{ my: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography>Testing connection...</Typography>
          </Box>
        ) : connectionStatus ? (
          <Box>
            <Typography
              color={connectionStatus.success ? "success.main" : "error.main"}
              fontWeight="bold"
            >
              {connectionStatus.success ? "Connected" : "Connection Failed"}
            </Typography>

            {connectionStatus.success && (
              <>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Response Time: {connectionStatus.responseTime}ms
                </Typography>
                <Typography variant="body2">
                  Server Time:{" "}
                  {new Date(connectionStatus.serverTime).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Environment: {connectionStatus.environment}
                </Typography>
                <Typography variant="body2">
                  Message: {connectionStatus.message}
                </Typography>
              </>
            )}

            {!connectionStatus.success && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Error: {connectionStatus.error}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography>No connection test has been run yet.</Typography>
        )}
      </Box>

      <Button
        variant="contained"
        onClick={runConnectionTest}
        disabled={loading}
      >
        {loading ? "Testing..." : "Test Connection Again"}
      </Button>
    </Paper>
  );
};

export default ConnectionTest;
