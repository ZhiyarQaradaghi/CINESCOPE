import { createContext, useState, useEffect, useContext } from "react";
import {
  loginUser,
  registerUser,
  getUserProfile,
  getFavorites,
} from "../services/movieApi";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await getUserProfile();
      setUser((prevUser) => ({ ...prevUser, ...userData }));
      loadFavorites();
    } catch (error) {
      console.error("Failed to load user profile:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritesData = await getFavorites();
      setFavorites(favoritesData || []);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await loginUser({ email, password });
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      await loadFavorites();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Failed to login. Please check your credentials.",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const userData = await registerUser({ username, email, password });
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed. Please try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setFavorites([]);
  };

  const value = {
    user,
    loading,
    favorites,
    login,
    register,
    logout,
    loadFavorites,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
