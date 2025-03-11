import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MovieIcon from "@mui/icons-material/Movie";
import { useState } from "react";

const Header = ({ currentPage, onPageChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pages = [
    { name: "Home", value: "home" },
    { name: "Popular", value: "popular" },
    { name: "Top Rated", value: "top_rated" },
    { name: "Upcoming", value: "upcoming" },
  ];

  const handlePageClick = (pageValue) => {
    onPageChange(pageValue);
    handleClose();
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
      <Container>
        <Toolbar disableGutters>
          <MovieIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: "linear-gradient(90deg, #646cff, #ff64c8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
            onClick={() => onPageChange("home")}
          >
            CineScope
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.value}
                    onClick={() => handlePageClick(page.value)}
                    selected={currentPage === page.value}
                  >
                    {page.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex" }}>
              {pages.map((page) => (
                <Button
                  key={page.value}
                  color={currentPage === page.value ? "primary" : "inherit"}
                  sx={{ mx: 1 }}
                  onClick={() => onPageChange(page.value)}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
