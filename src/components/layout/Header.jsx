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

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Watchlist", path: "/watchlist" },
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

  const handlePageClick = (path) => {
    navigate(path);
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
            onClick={() => navigate("/")}
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
                    key={page.path}
                    onClick={() => handlePageClick(page.path)}
                    selected={location.pathname === page.path}
                  >
                    {page.name}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                {pages.map((page) => (
                  <Button
                    key={page.path}
                    onClick={() => handlePageClick(page.path)}
                    color="inherit"
                    sx={{
                      fontWeight: location.pathname === page.path ? 700 : 400,
                      borderBottom:
                        location.pathname === page.path
                          ? `2px solid ${theme.palette.primary.main}`
                          : "none",
                      borderRadius: 0,
                      px: 1,
                    }}
                  >
                    {page.name}
                  </Button>
                ))}
              </Box>

              {user ? (
                <>
                  <IconButton
                    onClick={handleUserMenu}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: theme.palette.primary.main,
                      }}
                    >
                      {getInitials(user.name || user.email || "User")}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={userMenuAnchor}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                  >
                    <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    borderRadius: "50px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 4,
                    py: 1,
                    background:
                      "linear-gradient(45deg, #646cff 30%, #ff64c8 90%)",
                    boxShadow: "0 3px 15px rgba(100, 108, 255, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 5px 20px rgba(100, 108, 255, 0.4)",
                      background:
                        "linear-gradient(45deg, #535bf2 30%, #ff50c8 90%)",
                    },
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
