import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_SOCKET_SERVER || "http://localhost:5000";

export const makeRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Error for ${endpoint}:`, error);
    throw error;
  }
};

export default api;
