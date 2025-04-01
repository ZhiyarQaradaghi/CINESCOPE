const API_BASE_URL =
  import.meta.env.VITE_SOCKET_SERVER || "http://localhost:5000";

export const makeRequest = async (endpoint, options = {}) => {
  try {
    const apiPath = endpoint.startsWith("/api") ? endpoint : `/api${endpoint}`;
    const url = `${API_BASE_URL}${apiPath}`;

    console.log("Fetching:", url);

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Error for ${endpoint}:`, error);
    throw error;
  }
};
