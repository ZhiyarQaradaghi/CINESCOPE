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
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MovieIcon from "@mui/icons-material/Movie";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({ currentPage, onPageChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    { name: "Home", value: "home" },
    { name: "Popular", value: "popular" },
    { name: "Top Rated", value: "top_rated" },
    { name: "Upcoming", value: "upcoming" },
  ];

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handlePageClick = (page) => {
    onPageChange(page);

    if (location.pathname !== "/") {
      navigate("/");
    }

    handleClose();
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate("/");
  };

  const navigateToProfile = () => {
    navigate("/profile");
    handleUserMenuClose();
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
            onClick={() => {
              onPageChange("home");
              if (location.pathname !== "/") {
                navigate("/");
              }
            }}
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
                sx={{ mr: 1 }}
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
            <Box sx={{ display: "flex", mr: 2 }}>
              {pages.map((page) => (
                <Button
                  key={page.value}
                  color={currentPage === page.value ? "primary" : "inherit"}
                  sx={{ mx: 1 }}
                  onClick={() => handlePageClick(page.value)}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
          )}

          {user ? (
            <>
              <IconButton onClick={handleUserMenu}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 32,
                    height: 32,
                    fontSize: "0.875rem",
                  }}
                >
                  {getInitials(user.username)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Box>
              <Button
                color="inherit"
                onClick={() => navigate("/login")}
                sx={{ mx: 1 }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
