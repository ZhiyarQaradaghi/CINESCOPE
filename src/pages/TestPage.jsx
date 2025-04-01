import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import ConnectionTest from "../components/ConnectionTest";

const TestPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        System Tests
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This page contains various tests to verify system functionality.
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Box sx={{ mb: 4 }}>
        <ConnectionTest />
      </Box>

      {/* other test components */}
    </Container>
  );
};

export default TestPage;
