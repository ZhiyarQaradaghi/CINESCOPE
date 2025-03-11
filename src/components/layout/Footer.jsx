import React from "react";
import { Box, Typography, Link, Container, Divider } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ mt: 6, pb: 3 }}>
      <Container>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} CineScope. All rights reserved.
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 1 }}
        >
          Powered by{" "}
          <Link
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            TMDb API
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
