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
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
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
    { name: "TV Shows", path: "/tv" },
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
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        mb: 4,
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: "rgba(15, 15, 30, 0.7)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 1,
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <MovieIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
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
          </Box>

          {isMobile ? (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                flex: 1,
                justifyContent: "center",
                mx: 4,
              }}
            >
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
                    px: 2,
                    py: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Stack>
          )}

          {/* User Section */}
          <Box sx={{ flexShrink: 0 }}>
            {user ? (
              <>
                <IconButton
                  onClick={handleUserMenu}
                  size="small"
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

          {/* Mobile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              mt: 1,
              "& .MuiPaper-root": {
                backgroundColor: "rgba(26, 26, 46, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                minWidth: 180,
              },
            }}
          >
            {pages.map((page) => (
              <MenuItem
                key={page.path}
                onClick={() => handlePageClick(page.path)}
                selected={location.pathname === page.path}
                sx={{
                  py: 1.5,
                  px: 3,
                }}
              >
                {page.name}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
