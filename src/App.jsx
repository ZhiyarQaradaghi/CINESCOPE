import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
} from "@mui/material";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/auth/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import ExplorePage from "./pages/ExplorePage";
import WatchlistPage from "./pages/WatchlistPage";
import TVShowsPage from "./pages/TVShowsPage";
import TestPage from "./pages/TestPage";
import WatchPage from "./pages/WatchPage";
import WatchTVShowPage from "./pages/WatchTVShowPage";
import { ServerProvider } from "./contexts/ServerContext";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#646cff",
    },
    secondary: {
      main: "#ff64c8",
    },
    background: {
      default: "#0f0f1e",
      paper: "#1a1a2e",
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header />
          <Container maxWidth={false} disableGutters>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/tv" element={<TVShowsPage />} />
              <Route path="/tv/:category" element={<TVShowsPage />} />
              <Route
                path="/watch/:movieId"
                element={
                  <ServerProvider>
                    <WatchPage />
                  </ServerProvider>
                }
              />
              <Route
                path="/watch/tv/:showId/:season/:episode"
                element={
                  <ServerProvider>
                    <WatchTVShowPage />
                  </ServerProvider>
                }
              />
              <Route path="/test" element={<TestPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Container>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
