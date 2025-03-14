import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
  CircularProgress,
  Tab,
  Tabs,
  Paper,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MovieCard from "../favorites/FavoriteMovieCard";
import Loader from "../common/Loader";

const Profile = () => {
  const { user, logout, favorites, loadFavorites } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        await loadFavorites();
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, navigate, loadFavorites]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // this will generate the initials of the user's name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user) return <Loader />;

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 4 }}>
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid
              item
              xs={12}
              md={3}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "primary.main",
                  fontSize: "2rem",
                  mx: { xs: "auto", md: 0 },
                }}
              >
                {getInitials(user.username)}
              </Avatar>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h1" gutterBottom>
                {user.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Member since:{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{ textAlign: { xs: "center", md: "right" } }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper sx={{ boxShadow: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="My Favorites" />
          <Tab label="Account Settings" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              My Favorite Movies
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {isLoading ? (
              <Loader />
            ) : favorites.length > 0 ? (
              <Grid container spacing={3}>
                {favorites.map((movie) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                    <MovieCard movie={movie} isFavorite={true} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  You haven't added any favorites yet.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/")}
                >
                  Browse Movies
                </Button>
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Account Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              Account settings will be available in a future update.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;
